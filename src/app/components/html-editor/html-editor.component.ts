import { PluginButton } from './../../interfaces/plugin-button';
import { RichButtons } from './../../consts/rich-buttons.const';
import { ParagraphButtons } from './../../consts/paragraph-buttons.const';
import { TextButtons } from './../../consts/text-buttons.const';
import {
  ChangeDetectionStrategy, Component, ElementRef, ViewChild,
  AfterViewInit, forwardRef, OnDestroy, Input, HostBinding, ChangeDetectorRef, Optional, Inject
} from '@angular/core';


// import FroalaEditor from '../../froala/js/froala_editor.pkgd';

// import '../../froala/js/plugins/align';
// import '../../froala/js/plugins/colors';
// import '../../froala/js/plugins/image';
// import '../../froala/js/plugins/link';
// import '../../froala/js/plugins/lists';
// import '../../froala/js/plugins/paragraph_format'
// import '../../froala/js/plugins/table';
// import '../../froala/js/plugins/url';
// import '../../froala/js/plugins/video';

import FroalaEditor from 'froala-editor';

import { FsHtmlEditorConfig } from '../../interfaces';
import { FS_HTML_EDITOR_CONFIG } from '../../injects';

import { NG_VALIDATORS, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, Validator, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { merge } from 'lodash-es';
import { Plugin } from './../../classes/plugin';

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
export class FsHtmlEditorComponent implements AfterViewInit, ControlValueAccessor, Validator, OnDestroy {

  @HostBinding('class.focused') classFocused = false;
  @ViewChild('elRef') public elRef: ElementRef;
  @Input() public config: FsHtmlEditorConfig = {};
  @Input() public ngModel: string;

  public initialized = false;

  private _editor: FroalaEditor;
  private _html: string;
  private _destroy$ = new Subject();
  private _initializedSelection: { node?: any, offset?: number } = {};

  constructor(
    @Optional() @Inject(FS_HTML_EDITOR_CONFIG) private _defaultConfig,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public onChange = (data: any) => {};
  public onTouched = () => {};

  public get el(): any  {
    return this.elRef.nativeElement;
  }

  public get html(): string  {
    return this._html;
  }

  public get editor(): any  {
    return this._editor;
  }

  public ngAfterViewInit(): void {
    this._html = this.ngModel || '';

    const el = document.createElement('div');
    el.innerHTML = this._html;

    if (!this.config.initOnClick || !el.innerText.length) {
      this.initialize();
    }
  }

  public initialize(): void {
    const config = this._createConfig();

    this._initPlugins(config);
    this._editor = new FroalaEditor(this.el, this._createOptions(), () => {
      try {
        this._editor.html.set(this.html);
      } catch (e) {}

      this.initialized = true;
      this._cdRef.markForCheck();

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
        this._change(this._editor.html.get());
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
        this._editor.events.on('image.beforeUpload', (images) => {

          this.config.image.upload(images[0])
            .pipe(
              takeUntil(this._destroy$),
            )
            .subscribe((url) => {
              this.editor.image.insert(url, null, null, this.editor.image.get());
            });

          return false;
        });
      }

      this.el.querySelector('.second-toolbar').remove();

      const walk = document.createTreeWalker(this.el.querySelector('.fr-element'), NodeFilter.SHOW_TEXT, null, false);
      let node;
      while (node = walk.nextNode()) {
        if (this._initializedSelection.node === node.textContent) {
          const range = document.createRange();
          const sel = window.getSelection();

          range.setStart(node, this._initializedSelection.offset);
          range.collapse(true)

          sel.removeAllRanges();
          sel.addRange(range);
          break;
        }
      }
    });
  }

  public uninitializedClick(event: UIEvent): void {
    if (this.config.initClick) {
      this.config.initClick(event);
    }

    if (!event.defaultPrevented) {
      const target: any = event.target;
      if (target && target.nodeName === 'A' && target.getAttribute('href')) {
        target.setAttribute('target', '_blank');
        setTimeout(() => {
          target.removeAttribute('target');
        });
      } else {
        const selection: any = window.getSelection();
        if (selection.baseNode) {
          this._initializedSelection = {
            node: selection.baseNode.nodeValue,
            offset: selection.baseOffset,
          };
        }
        this.initialize();
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

  public focus() {
    this.editor.events.focus();
  }

  public clear() {
    this.writeValue('');
  }

  public disable() {
    this.editor.edit.off();
  }

  public setHtml(html) {
    this.writeValue(html);
  }

  public writeValue(html: string): void {
    this._html = html || '';
    this._cdRef.markForCheck();
    if (this.editor && this.editor.html) {
      try {
        this.editor.html.set(this._html);
      } catch (e) {}
    }
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this.destroy();
  }

  public destroy() {
    if (this.editor) {
      this.editor.destroy();
    }
    this.initialized = false;
    this._initializedSelection = {};
    this._cdRef.markForCheck();
    this.el.innerHTML = '';
  }

  private _createConfig() {
    return merge({ froalaConfig: {} }, this._defaultConfig, this.config);
  }

  private _change(html): void {
    this._html = html;
    this.onChange(html);
  }

  private _initPlugins(config) {

    (config.plugins || []).forEach((plugin: Plugin) => {
      FroalaEditor.PLUGINS[plugin.config.name] = function (editor) {
        plugin.editor = editor;
        plugin.initialize();
        return plugin;
      };

      (plugin.config.buttons || []).forEach((button: PluginButton) => {
        FroalaEditor.DefineIcon(button.name, {
          NAME: button.name,
          PATH: button.svgPath,
        });

        FroalaEditor.RegisterCommand(button.name, {
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
        imageDefaultWidth: 0,
        imageDefaultAlign: 'left',
        paragraphDefaultSelection: 'Format',
        videoUpload: false,
        paragraphFormat: {
          N: 'Normal',
          H1: 'Heading 1',
          H2: 'Heading 2',
          H3: 'Heading 3',
          H4: 'Heading 4'
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
            buttonsVisible: 2,
          },
          moreParagraph: {
            buttons: ParagraphButtons,
            buttonsVisible: 3,
          },
          moreRich: {
            buttons: RichButtons,
            buttonsVisible: 5,
          },
        },
      },
      config.froalaConfig,
    );
  }
}
