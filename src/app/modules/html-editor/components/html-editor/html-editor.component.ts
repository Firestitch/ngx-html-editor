import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgForm,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { guid } from '@firestitch/common';
import { FileProcessor, FsFile, FsFileProcessConfig } from '@firestitch/file';


import { BehaviorSubject, fromEventPattern, Observable, ReplaySubject, Subject } from 'rxjs';
import {
  distinctUntilChanged, filter, map, skip, startWith, switchMap, takeUntil, tap,
} from 'rxjs/operators';

import { FroalaOptions } from 'froala-editor';
import { merge } from 'lodash-es';

import { ParagraphButtons, RichButtons, ToolbarButtons, ToolbarXsButtons } from '../../consts';
import { FsHtmlEditorContainerDirective } from '../../directives';
import { FS_HTML_EDITOR_CONFIG } from '../../injects/config.inject';
import { ToolbarButton } from '../../interfaces';
import { FsHtmlEditorConfig } from '../../interfaces/html-editor-config';
import { FsFroalaLoaderService } from '../../services/froala-loader.service';

import { Plugin } from './../../classes/plugin';
import { TextButtons } from './../../consts/text-buttons.const';


@Component({
  selector: 'fs-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsHtmlEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FsHtmlEditorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      deps: [[Optional, NgForm]],
      useFactory: (ngForm: NgForm) => ngForm,
    },
  ],
})
export class FsHtmlEditorComponent
implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnDestroy {

  @ContentChild(FsHtmlEditorContainerDirective, { read: TemplateRef })
  public htmlEditorContainer: TemplateRef<any>;

  @HostBinding('class.focused') public classFocused = false;

  @ViewChild('elRef') public elRef: ElementRef;

  @Input() public config: FsHtmlEditorConfig = {};

  @Input()
  @HostBinding('class.disabled')
  public disabled = false;

  @HostBinding('class.initialized')
  public initialized = false;

  public readonly containerID = `fs-html-editor-${guid('xxx')}`;
  public onTouched: () => void;
  public onChange: (data: any) => void;

  private _dialogRef: MatDialogRef<unknown> = inject(MatDialogRef, { optional: true });
  private _documentRef: Document = inject(DOCUMENT);

  private _editor: any;
  private _html: string;
  private _initialize$ = new ReplaySubject();
  private _froalaReady$ = new BehaviorSubject<{
    config: FsHtmlEditorConfig,
    options: any
  }>(null);
  private _destroy$ = new Subject();

  constructor(
    @Optional()
    @Inject(FS_HTML_EDITOR_CONFIG)
    private _defaultConfig: FsHtmlEditorConfig,
    private _cdRef: ChangeDetectorRef,
    private _fr: FsFroalaLoaderService,
  ) { }

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

  public get dialogRef(): MatDialogRef<unknown> {
    return this._dialogRef;
  }

  public ngOnInit(): void {
    this.config = this.config || {};
    this.config.autofocus = this.config.autofocus && (!this.config.disabled || !this.disabled);
    this.initialized = !this.config.initOnClick;
  }

  public ngAfterViewInit() {
    this._listenLazyInit();
    this._initialize$.next(null);
  }

  public hasContent() {
    const el = document.createElement('div');

    if (el.querySelector('img')) {
      return true;
    }

    el.innerHTML = this._html;

    return !!el.innerText.length;
  }

  public uninitialize() {
    this.initialized = false;
    this._cdRef.markForCheck();
  }

  public initialize(options: any = {}) {
    const config = this._createConfig();
    this._initPlugins(config);
    this._initButtons(config);

    const froalaOptions = this._createOptions();

    this._editor = new this._fr.FroalaEditor(this.el, froalaOptions, () => {
      this._froalaReady$.next({ config, options });
    });
  }

  public updateSize() {
    // Hack: To trigger the toolbar button size modes
    window.dispatchEvent(new Event('resize'));
  }

  public validate(): ValidationErrors | null {
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
    this.disabled = true;
    this._cdRef.markForCheck();
  }

  public setHtml(html) {
    this.writeValue(html);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(html: string): void {
    this._html = html || '';

    if (Array.isArray(this._html)) {
      this._html = this._html.pop();
    }

    this._html = this._html
      .replace(/<(li)>\s?<(div)>/g, '<li>')
      .replace(/<\/(div)><\/(li)>/g, '</li>');

    if (this.editor && this.editor.html) {
      try {
        this.editor.html.set(this._html);
      } catch {
        //
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
    this._destroy$.next(null);
    this._destroy$.complete();
    this.destroy();
  }

  public destroy() {
    if (this.editor) {
      this.editor.destroy();
    }

    this.initialized = false;
    this._cdRef.markForCheck();
  }

  private _processImageUpload(blob) {
    const processor = new FileProcessor();
    const file = new FsFile(blob);

    const config: FsFileProcessConfig = {
      orientate: true,
      quality: this.config.image.quality,
      format: this.config.image.format as any,
      maxWidth: this.config.image.width,
      maxHeight: this.config.image.height,
      minWidth: this.config.image.minWidth,
      minHeight: this.config.image.minHeight,
    };

    return processor.processFile(file, config)
      .pipe(
        switchMap((fsFile: FsFile) => {
          return this.config.image.upload(fsFile.file);
        }),
      );
  }

  private _createConfig(): FsHtmlEditorConfig {
    return merge({ froalaConfig: {} }, this._defaultConfig, this.config);
  }

  private _change(html): void {
    this._html = html;
    this.onChange(html);
  }

  private _initButtons(config: FsHtmlEditorConfig) {
    (config.buttons || [])
      .forEach((button) => {
        /*
          Svg Keys:
          ["add", "advancedImageEditor", "alignCenter", "alignJustify", "alignLeft", "alignRight",
          "anchors", "back", "backgroundColor", "blockquote", "bold", "cellBackground",
          "cellBorderColor", "cellOptions", "cellStyle", "clearFormatting", "close", "codeView",
          "cogs", "columns", "editLink", "exitFullscreen", "fontAwesome", "fontFamily",
          "fontSize", "fullscreen", "help", "horizontalLine", "imageAltText", "imageCaption",
          "imageClass", "imageDisplay", "imageManager", "imageSize", "indent", "inlineClass",
          "inlineStyle", "insertEmbed", "insertFile", "insertImage", "insertLink", "insertMore",
          "insertTable", "insertVideo", "upload", "italic", "search", "lineHeight", "linkStyles",
          "mention", "more", "openLink", "orderedList", "outdent", "pageBreaker",
          "paragraphFormat", "paragraphMore", "paragraphStyle", "pdfExport", "print",
          "redo", "removeTable", "remove", "replaceImage", "row", "selectAll", "smile",
          "spellcheck", "star", "strikeThrough", "subscript", "superscript", "symbols", "tags",
          "tableHeader", "tableStyle", "textColor", "textMore", "underline", "undo", "unlink",
          "unorderedList", "verticalAlignBottom", "verticalAlignMiddle", "verticalAlignTop"]
        */

        if (button.svgKey) {
          this._fr.FroalaEditor.DefineIcon(button.name, { SVG_KEY: button.svgKey });
        }

        this._fr.FroalaEditor.RegisterCommand(button.name, {
          title: button.title,
          focus: button.focus ?? true,
          undo: button.undo ?? true,
          refreshAfterCallback: button.refreshAfterCallback ?? true,
          callback() {
            button.click(this);
          },
        });
      });
  }

  private _initToolbarButtons(buttons) {
    (buttons || [])
      .filter((button) => typeof button !== 'string')
      .forEach((button: ToolbarButton) => {
        this._defineButton(button);
      });
  }

  private _initPlugins(config: FsHtmlEditorConfig) {
    this._initToolbarButtons(config.toolbar?.text?.prepend);
    this._initToolbarButtons(config.toolbar?.paragraph?.prepend);
    this._initToolbarButtons(config.toolbar?.rich?.prepend);

    (config.plugins || [])
      .forEach((plugin: Plugin) => {
        this._fr.FroalaEditor.PLUGINS[plugin.config.name] = function (editor) {
          plugin.editor = editor;
          plugin.initialize();

          return plugin;
        };

        (plugin.config.buttons || [])
          .forEach((button: ToolbarButton) => {
            this._defineButton(button);
          });
      });
  }

  private _defineButton(button: ToolbarButton) {
    if(button.html) {
      this._fr.FroalaEditor
        .DefineIconTemplate(`${button.name}-template`, button.html);
      this._fr.FroalaEditor
        .DefineIcon(button.name, {
          NAME: `${button.name}-icon`,
          template: `${button.name}-template`,
        });

    } else {
      this._fr.FroalaEditor.DefineIcon(button.name, {
        NAME: button.name,
        PATH: button.svgPath,
      });
    }

    this._fr.FroalaEditor.RegisterCommand(button.name, {
      icon: button.name,
      title: button.tooltip,
      undo: button.undo,
      focus: button.focus,
      showOnMobile: button.showOnMobile,
      refreshAfterCallback: button.refreshAfterCallback,
      callback() {
        if (button.click) {
          button.click(this);
        }
      },
      refresh(event) {
        if (event.refresh) {
          event.refresh(this, event);
        }
      },
    });

  }

  private _buttonsToNames(buttons) {
    return (buttons || [])
      .map((item) => {
        return typeof item === 'string' ? item : item.name;
      });
  }

  private _createOptions() {
    const config = this._createConfig();

    const moreText = [
      ...this._buttonsToNames(config.toolbar?.text?.prepend),
      ...TextButtons,
    ];

    const moreParagraph = [
      ...this._buttonsToNames(config.toolbar?.paragraph?.prepend),
      ...ParagraphButtons,
    ];

    const moreRich = [
      ...this._buttonsToNames(config.toolbar?.rich?.prepend),
      ...RichButtons,
    ];

    const toolbarButtons = merge(
      {},
      ToolbarButtons,
      {
        moreText: { buttons: moreText },
        moreParagraph: { buttons: moreParagraph },
        moreRich: { buttons: moreRich },
      });

    const froalaOptions: Partial<FroalaOptions> = {
      shortcutsEnabled: ['show', 'bold', 'italic', 'underline', 'indent', 'outdent', 'undo', 'redo', 'insertImage', 'createLink'],
      key: config.activationKey,
      placeholderText: config.placeholder,
      linkAlwaysBlank: true,
      linkInsertButtons: [],
      linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],  
      linkMultipleStyles: false,
      heightMin: this._dialogRef ? 200 : 0,
      tabSpaces: 2,
      toolbarSticky: false,
      listAdvancedTypes: false,
      typingTimer: 250,
      tooltips: false,
      wordPasteModal: false,
      imageDefaultWidth: 0,
      paragraphStyles: {
        class1: 'Class 1',
        class2: 'Class 2',
      },
      imageDefaultAlign: 'left',
      fontFamilyDefaultSelection: 'Font Family',
      quickInsertEnabled: false,
      scrollableContainer: `#${this.containerID}`,
      paragraphDefaultSelection: 'Format',
      videoUpload: false,
      imagePaste: !!config.image?.upload,
      imageUpload: !!config.image?.upload,
      paragraphFormat: {
        N: 'Normal',
        H1: 'Heading 1',
        H2: 'Heading 2',
        H3: 'Heading 3',
        H4: 'Heading 4',
        BLOCKQUOTE: 'Quote',
      },
      lineHeights: {
        Default: '',
        0.5: '0.5',
        Single: '1',
        1.15: '1.15',
        1.5: '1.5',
        Double: '2',
      },
      paragraphFormatSelection: true,
      toolbarButtons,
      toolbarButtonsXS: ToolbarXsButtons,
    };

    const options = merge(
      // For some reason editor store somewhere pointer on default config object and dublicate options each time on init
      // Extra merge level fixed this problem and allow to init config properly without legacy data
      {},
      froalaOptions,
      config.froalaConfig,
    );

    return options;
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
        tap(({ config }) => {
          this._setupFroala(config);
        }),
      )
      .subscribe();
  }

  private _contentChanged(): void {
    const editorHTML = this._editor.html.get();

    if (this.html !== editorHTML) {
      this._change(editorHTML);
    }
  }

  private _setupFroala(config: FsHtmlEditorConfig): void {
    this._cdRef.markForCheck();

    this.setHtml(this._html);

    if (config.disabled) {
      this.disable();
    }

    if (config.initialized) {
      config.initialized();
    }

    this._editor.events.on('focus', () => {
      this.classFocused = true;
      this._cdRef.markForCheck();
    });

    this._editor.events.on('blur', () => {
      this.classFocused = false;
      this._cdRef.markForCheck();
    });

    this._editor.events.on('click', () => {
      if (this.config.initOnClick && !this.initialized) {
        this.initialized = true;
        this._cdRef.markForCheck();
      }
    });

    fromEventPattern(
      (handler) => {
        this._editor.events.on('contentChanged', handler);
      },
      () => {
        //
      },
    )
      .pipe(
        startWith(this._html),
        map(() => this.editor.html.get()),
        distinctUntilChanged(),
        skip(1),
      )
      .subscribe(() => {
        this._contentChanged();
      });

    this._editor.events.on('paste.afterCleanup', (html) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      div.querySelectorAll('*')
        .forEach((el) => {
          for (let i = 0; i < el.attributes.length; i++) {
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

    if (this.config.autofocus && !this.config.initOnClick) {
      this.focus();
    }
  }
}
