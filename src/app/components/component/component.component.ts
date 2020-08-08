import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, AfterViewInit, forwardRef, OnDestroy, NgZone, ChangeDetectorRef, Input } from '@angular/core';

import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/colors.min.js';
// import 'froala-editor/js/plugins/code_beautifier.min.js';
// import 'froala-editor/js/plugins/code_view.min.js';
// import 'froala-editor/js/plugins/draggable.min.js';
// import 'froala-editor/js/plugins/emoticons.min.js';
// import 'froala-editor/js/plugins/file.min.js';
// import 'froala-editor/js/plugins/font_size.min.js';
// import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image.min.js';
// import 'froala-editor/js/plugins/image_manager.min.js';
// import 'froala-editor/js/third_party/image_tui.min.js';
// import 'froala-editor/js/plugins/inline_class.min.js';
// import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
 //import 'froala-editor/js/plugins/paragraph_style.min.js';
 import 'froala-editor/js/plugins/paragraph_format.min.js'
// import 'froala-editor/js/plugins/print.min.js';
// import 'froala-editor/js/plugins/quick_insert.min.js';
// import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/video.min.js';
// import 'froala-editor/js/plugins/word_paste.min.js';
// import 'src/assets/js/html2pdf.bundle.min.js';

import { FsHtmlEditorConfig } from './../../interfaces';

import FroalaEditor from 'froala-editor';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, Validator, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-component',
  templateUrl: 'component.component.html',
  styleUrls: ['component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsComponentComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FsComponentComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsComponentComponent implements AfterViewInit, ControlValueAccessor, Validator, OnDestroy {

  @ViewChild('elRef') public elRef: ElementRef;
  @Input() public config: FsHtmlEditorConfig = {};

  private _editor: FroalaEditor;
  private _destroy$ = new Subject();

  public model;

  constructor(
    private _ngZone: NgZone,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public onChange = (data: any) => {};
  public onTouched = () => {};

  public get el(): any  {
    return this.elRef.nativeElement;
  }

  public get editor(): any  {
    return this._editor;
  }

  public ngAfterViewInit(): void {
    this._editor = new FroalaEditor(this.el, this._createOptions());
  }

  public validate(control: AbstractControl): ValidationErrors | null {

    if (!this._editor) {
      return null
    }

    const err: any = {};
    // if (this.options.maxLength && isArray(this.ngModel)) {
    //   const length = JSON.stringify(this.ngModel).length;
    //   const maxLength = this.options.maxLength;
    //   if (length > maxLength) {
    //     err.maxLengthError = `Must be ${maxLength} characters or fewer. You entered ${length} characters.`;
    //   }
    // }

    return Object.keys(err).length ? err : null;
  }

  public focus() {
    //this._richTextService.quill.focus();
  }

  public clear() {
    //this.writeValue('');
  }

  public writeValue(data: any): void {

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

    // if (this._richTextService.quill) {
    //   this._richTextService.quill.off('text-change', this._textChange);
    //   this._richTextService.quill.root.removeEventListener('blur', this._blured);
    //   this._richTextService.quill.root.removeEventListener('focus', this._focused);
    // }

    // this._richTextService.destroy();
    // this.destroyed.emit();
    // this._cdRef.markForCheck();
  }

  private _createOptions() {
    return {
      //placeholderText: 'test',
      events: {
        focus: (e, editor) => {

        },
        contentChanged: () => {
          this._ngZone.runOutsideAngular(() => {
            console.log('onchagne');
            this.onChange(this._editor.html.get());
            //this._cdRef.markForCheck();
          });
        },
        'image.beforeUpload': (images) => {

          if (this.config.image.upload) {

            this.config.image.upload(images[0])
              .pipe(
                takeUntil(this._destroy$),
              )
              .subscribe((url) => {
                this.editor.image.insert(url, null, null, this.editor.image.get());
              });
          }

          return false;
        },
        initialized: () => {
          this.el.querySelector('.second-toolbar').remove();
        },
        keydown: (e) => {

        }
      },
      toolbarButtons: {
        moreText: {
          buttons: [
            'bold',
            'italic',
            'table',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript',
            'fontFamily',
            'fontSize',
            'textColor',
            'backgroundColor',
            'inlineClass',
            'inlineStyle',
            'clearFormatting',
          ]
        },
        moreParagraph: {
          buttons: [
            'alignLeft',
            'alignCenter',
            'formatOLSimple',
            'alignRight', 'alignJustify',
            'formatOL', 'formatUL',
            'paragraphFormat',
            'paragraphStyle',
            'lineHeight',
            'outdent',
            'indent',
            'quote'
          ]
        },
        moreRich: {
          buttons: [
            'insertLink',
            'insertImage',
            'insertVideo',
            'insertTable',
            'emoticons',
            'fontAwesome',
            'specialCharacters',
            'embedly',
            'insertFile',
            'insertHR',
          ],
          buttonsVisible: 10
        },

      }
    };
  }
}
