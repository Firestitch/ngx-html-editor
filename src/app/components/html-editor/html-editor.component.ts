import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import { FileProcessor, FsFile } from '@firestitch/file';

import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { merge } from 'lodash-es';

import { PluginButton } from './../../interfaces/plugin-button';
import { FsHtmlEditorConfig } from '../../interfaces/html-editor-config';
import { RichButtons } from './../../consts/rich-buttons.const';
import { TextButtons } from './../../consts/text-buttons.const';
import { ParagraphButtons } from './../../consts/paragraph-buttons.const';

import { FS_HTML_EDITOR_CONFIG } from '../../injects/config.inject';
import { Plugin } from './../../classes/plugin';

import { FsFroalaLoaderService } from '../../services/froala-loader.service';


@Component({
  selector: 'fs-html-editor',
  templateUrl: 'html-editor.component.html',
  styleUrls: ['html-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsHtmlEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FsHtmlEditorComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsHtmlEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnDestroy {

  @HostBinding('class.focused') classFocused = false;
  @HostBinding('class.disabled') classDisabled = false;

  @ViewChild('elRef') public elRef: ElementRef;

  @Input() public config: FsHtmlEditorConfig = {};

  public initialized = false;

  private _editor: any;
  private _html: string;
  private _initialize$ = new ReplaySubject();
  private _froalaReady$ = new BehaviorSubject(null);
  private _destroy$ = new Subject();

  constructor(
    @Optional() @Inject(FS_HTML_EDITOR_CONFIG) private _defaultConfig,
    private _cdRef: ChangeDetectorRef,
    private _fr: FsFroalaLoaderService,
  ) { }

  public onChange = (data: any) => {}
  public onTouched = () => {}

  public get el(): any {
    return this.elRef.nativeElement;
  }

  public get html(): string {
    return this._html;
  }

  public get editor(): any {
    return this._editor;
  }

  public get froalaLoaded$(): Observable<boolean> {
    return this._fr.loaded$;
  }

  public ngOnInit(): void {
    this.config = this.config || {};
    this.config.autofocus = this.config.autofocus !== false && !this.config.disabled;
    this.initialized = !this.config.initOnClick;
    this._listenLazyInit();
  }

  public ngAfterViewInit() {
    if (!this.config.initOnClick || !this.hasContent()) {
      this.initialized = true;
      this._initialize$.next();
    }
  }

  public hasContent() {
    const el = document.createElement('div');

    if (el.querySelector('img')) {
      return true;
    }

    el.innerHTML = this._html;
    return !!el.innerText.length;
  }

  public initialize(options: any = {}) {
    const config = this._createConfig();

    this._initPlugins(config);
    // this.el.innerHTML = this._html || '';

    this._editor = new this._fr.FroalaEditor(this.el, this._createOptions(), () => {
      this._froalaReady$.next({ config, options });
    });
  }

  private _processImageUpload(blob) {
    const processor = new FileProcessor();
    const file = new FsFile(blob);

    return processor.process([file], this.config.image)
      .pipe(
        switchMap(([f]: FsFile[]) => {
          return this.config.image.upload(f.file)
        }),
      );
  }

  private _getTextNode(node) {
    if (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node;
      }
      if (node.childNodes) {
        return this._getTextNode(node.childNodes[0]);
      }
    }
  }

  public uninitializedClick(event: UIEvent): void {
    if (!event.defaultPrevented) {
      const target: any = event.target;
      if (target && target.nodeName === 'A' && target.getAttribute('href')) {
        const targetTarget = target.getAttribute('target');
        target.setAttribute('target', '_blank');
        setTimeout(() => {
          if (targetTarget) {
            target.setAttribute('target', targetTarget);
          } else {
            target.removeAttribute('target');
          }
        });
      } else {
        if (this.config.initClick) {
          this.config.initClick(event);
        }
        this._initialize$.next();
        this.initialized = true;
      }
    }
  }

  public updateSize() {
    // Hack: To trigger the toolbar button size modes
    window.dispatchEvent(new Event('resize'));
  }

  public validate(control: AbstractControl): ValidationErrors | null {

    const err: any = {};
    if (this.config.maxLength && this._html) {
      const maxLength = this.config.maxLength;
      const length = this._html.length;
      if (length > maxLength) {
        err.maxLengthError = `Must be ${maxLength} characters or fewer. You entered ${length} characters.`;
      }
    }

    return Object.keys(err).length ? err : null;
  }

  public focus(options?: { cursorPosition?: 'start' | 'end' }) {
    options = options ? options : {};

    if (options.cursorPosition === 'end') {
      this.editor.selection.setAtEnd(this.editor.$el.get(0));
    } else {
      this.editor.selection.setAtStart(this.editor.$el.get(0));
    }

    this.editor.selection.restore();

    const elSelection = this.editor.selection.element();
    if (elSelection) {
      elSelection.scrollIntoView({ block: 'center' });
    }
  }

  public clear() {
    this.writeValue('');
  }

  public disable() {
    this.classDisabled = true;
  }

  public setHtml(html) {
    this.writeValue(html);
  }

  public writeValue(html: string): void {
    this._html = html || '';

    if (this.editor && this.editor.html) {
      try {
        this.editor.html.set(this._html);
      } catch (e) {
      }
    }

    this._cdRef.markForCheck();
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngOnDestroy() {
    this._initialize$.complete();
    this._destroy$.next();
    this._destroy$.complete();
    this.destroy();
  }

  public destroy() {
    if (this.editor) {
      this.editor.destroy();
    }
    this.initialized = false;
    this._cdRef.markForCheck();
    this.el.innerHTML = '';
  }

  private _createConfig(): FsHtmlEditorConfig {
    return merge({ froalaConfig: {} }, this._defaultConfig, this.config);
  }

  private _change(html): void {
    // this._html = html;
    this.onChange(html);
  }

  private _initPlugins(config) {

    (config.plugins || []).forEach((plugin: Plugin) => {
      this._fr.FroalaEditor.PLUGINS[plugin.config.name] = function (editor) {
        plugin.editor = editor;
        plugin.initialize();
        return plugin;
      };

      (plugin.config.buttons || []).forEach((button: PluginButton) => {
        this._fr.FroalaEditor.DefineIcon(button.name, {
          NAME: button.name,
          PATH: button.svgPath,
        });

        this._fr.FroalaEditor.RegisterCommand(button.name, {
          icon: button.name,
          title: button.tooltip,
          undo: button.undo,
          focus: button.focus,
          showOnMobile: button.showOnMobile,
          refreshAfterCallback: button.refreshAfterCallback,
          callback: function () {
            if (button.click) {
              button.click(this);
            }
          },
          refresh: function (button) {
            if (button.refresh) {
              button.refresh(this, button);
            }
          }
        });
      });

    });
  }

  private _createOptions() {
    const config = this._createConfig();

    return merge(
      // For some reason editor store somewhere pointer on default config object and dublicate options each time on init
      // Extra merge level fixed this problem and allow to init config properly without legacy data
      {},
      {
        key: config.activationKey,
        placeholderText: config.placeholder,
        linkAlwaysBlank: true,
        tabSpaces: 2,
        typingTimer: 250,
        tooltips: false,
        wordPasteModal: false,
        imageDefaultWidth: 0,
        imageDefaultAlign: 'left',
        quickInsertEnabled: false,
        paragraphDefaultSelection: 'Format',
        videoUpload: false,
        paragraphFormat: {
          N: 'Normal',
          H1: 'Heading 1',
          H2: 'Heading 2',
          H3: 'Heading 3',
          H4: 'Heading 4',
          BLOCKQUOTE: 'Quote',
        },
        paragraphFormatSelection: true,
        toolbarButtonsXS: {
          moreText: {
            buttons: TextButtons,
            buttonsVisible: 1,
          },
          moreParagraph: {
            buttons: ParagraphButtons,
            buttonsVisible: 2,
          },
          moreRich: {
            buttons: RichButtons,
            buttonsVisible: 0,
          },
        },
        toolbarButtons: {
          moreText: {
            buttons: TextButtons,
            buttonsVisible: 3,
          },
          moreParagraph: {
            buttons: ParagraphButtons,
            buttonsVisible: 5,
          },
          moreRich: {
            buttons: RichButtons,
            buttonsVisible: 3,
          },
        },
      },
      config.froalaConfig,
    );
  }

  private _listenLazyInit() {
    this.froalaLoaded$
      .pipe(
        filter((ready) => ready),
        switchMap(() => this._initialize$),
        tap(() => {
          const selection: any = window.getSelection();
          const options: any = {};
          if (selection.baseNode) {
            options.selection = {
              node: selection.baseNode.nodeValue,
              offset: selection.baseOffset,
            };
          }
          this.initialize(options);
        }),
        switchMap(() => this._froalaReady$),
        filter((data) => !!data),
        tap(({ config, options }) => {
          this._setupFroala(config, options);
        })
      )
      .subscribe();
  }

  private _contentChanged(): void {
    const editorHTML = this._editor.html.get();

    if (this.html !== editorHTML) {
      this._change(editorHTML);
    }
  }

  private _setupFroala(config: FsHtmlEditorConfig, options: any): void {
    this._cdRef.markForCheck();

    this.setHtml(this._html);

    if (config.disabled) {
      this.disable();
    }

    if (config.froalaConfig.events) {
      if (config.froalaConfig.events.initialized) {
        config.froalaConfig.events.initialized();
      }
    }

    this._editor.events.on('focus', () => {
      this.classFocused = true;
      this._cdRef.markForCheck();
    });

    this._editor.events.on('blur', () => {
      this.classFocused = false;
      this._cdRef.markForCheck();
    });

    this._editor.events.on('contentChanged', () => {
      this._contentChanged();
    });

    this._editor.events.on('paste.afterCleanup', (html) => {
      var div = document.createElement('div');
      div.innerHTML = html;
      div.querySelectorAll('*')
        .forEach((el) => {
          for (var i = 0; i < el.attributes.length; i++) {
            const name = el.attributes[0].name;
            if (name !== 'href') {
              el.removeAttribute(name);
            }
          }
        });
      return div.innerHTML;
    });

    this._editor.events.on('keydown', () => {
      this.onTouched();
    });

    if (this.config.image && this.config.image.upload) {
      this._editor.events.on('image.beforePasteUpload', (image) => {

        fetch(image.getAttribute('src'))
          .then((res) => {
            res.blob()
              .then((blob) => {
                this._processImageUpload(blob)
                  .pipe(
                    takeUntil(this._destroy$),
                  )
                  .subscribe((url) => {
                    image.setAttribute('src', url);
                    image.removeAttribute('data-fr-image-pasted');

                    this._contentChanged();
                  });
              });
          });

        return false;
      });

      this._editor.events.on('image.beforeUpload', (blobs) => {
        this._processImageUpload(blobs[0])
          .pipe(
            takeUntil(this._destroy$),
          )
          .subscribe((url) => {
            this.editor.image.insert(url, null, null, this.editor.image.get());
          });

        return false;
      });
    }

    if (this.el.querySelector('.fr-second-toolbar')) {
      this.el.querySelector('.fr-second-toolbar').remove();
    }

    const selection = options.selection;

    if (selection) {
      const node: any = Array.from(this.el.querySelectorAll('.fr-element *')).find((node: any) => {
        return selection.node === node.textContent;
      });

      if (node) {
        const range = document.createRange();
        const sel = window.getSelection();

        range.setStart(this._getTextNode(node), selection.offset);
        range.collapse(true)

        sel.removeAllRanges();
        sel.addRange(range);
      } else if (this.config.autofocus) {
        this.focus();
      }
    } else if (this.config.autofocus) {
      this.focus();
    }
  }
}
