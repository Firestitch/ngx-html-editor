import { RichButtons } from './../../consts/rich-buttons.const';
import { ParagraphButtons } from './../../consts/paragraph-buttons.const';
import { TextButtons } from './../../consts/text-buttons.const';
import {
  ChangeDetectionStrategy, Component, ElementRef, ViewChild,
  AfterViewInit, forwardRef, OnDestroy, Input, HostBinding, ChangeDetectorRef, Optional, Inject
} from '@angular/core';

import Tribute, { TributeItem } from 'tributejs';

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

import { registerPluginChecklist } from '../../plugins/checklist';
import { registerPluginCode } from '../../plugins/code';
import { registerPluginMention } from '../../plugins/mention';

import { FsHtmlEditorConfig } from '../../interfaces';
import { FS_HTML_EDITOR_CONFIG } from '../../injects';

import { NG_VALIDATORS, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, Validator, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounce, merge } from 'lodash-es';

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

  public model;

  private _editor: FroalaEditor;
  private _html: string;
  private _destroy$ = new Subject();
  private _tributes = {};

  constructor(
    @Optional() @Inject(FS_HTML_EDITOR_CONFIG) private _defaultConfig,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public onChange = (data: any) => {};
  public onTouched = () => {};

  public get el(): any  {
    return this.elRef.nativeElement;
  }

  public get editor(): any  {
    return this._editor;
  }

  public ngAfterViewInit(): void {
    this.el.innerHTML = this.ngModel || '';
    const config = this._createConfig();
    this._initPlugins();
    this._initMentions(config);

    this._editor = new FroalaEditor(this.el, this._createOptions(), () => {
      (config.mentions || []).forEach((mention) => {
        const tribute = this._tributes[mention.name];
        tribute.attach(this._editor.el);
        this._editor.events.on('keydown', function (e) {
          if (e.which == FroalaEditor.KEYCODE.ENTER &&  tribute.isActive) {
            return false;
          }
        }, true);
      });

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
        this.onChange(this._editor.html.get());
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
    });
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
    if (this._editor && this._editor.html) {
      try {
        this._editor.html.set(this._html);
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
    this._editor.destroy();
  }

  private _createConfig() {
    return merge({ froalaConfig: {} }, this._defaultConfig, this.config);
  }

  private _loadValues(mention, keyword, cb) {
    return mention.fetch(keyword)
              .subscribe((data) => {
                cb(data);
              });
  }

  private _initPlugins() {
    registerPluginChecklist();
    registerPluginCode();
  }

  private _initMentions(config) {
    (config.mentions || []).forEach((mention) => {
      const tribute = new Tribute({
        values: debounce(this._loadValues.bind(this, mention), 200),
        searchOpts: {
          pre: '',
          post: '',
          skip: true
        },
        containerClass: `fs-html-editor-mention-container ${mention.containerClass || ''}`,
        itemClass: `fs-html-editor-mention-menu-item ${mention.menuItemClass || ''}`,
        trigger: mention.trigger,
        allowSpaces: true,
        menuItemTemplate: (item: TributeItem<any>) => {
          return mention.menuItemTemplate(item.original);
        },
        selectTemplate: (item: TributeItem<any>) => {
          const template = mention.selectedTemplate(item.original);

          let p = document.createElement('p');
          p.innerHTML = template;

          let node = p.firstElementChild;
          if (!node) {
            node = document.createElement('span');
            node.innerHTML = template;
          }

          node.setAttribute('contenteditable', 'false');
          node.classList.add('fr-deletable');

          return node.outerHTML;
        },
      });

      this._tributes[mention.name] = tribute;
      registerPluginMention(mention, tribute);
    });
  }

  private _createOptions() {
    const config = this._createConfig();

    return merge({
        key: config.activationKey,
        placeholderText: config.placeholder,
        linkAlwaysBlank: true,
        tabSpaces: 2,
        typingTimer: 250,
        tooltips: false,
        imageDefaultWidth: 0,
        imageDefaultAlign: 'left',
        paragraphDefaultSelection: 'Format',
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
