import {
  ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsApi } from '@firestitch/api';
import { guid } from '@firestitch/common';
import {
  ChecklistPlugin,
  CodePlugin,
  FsHtmlEditorComponent,
  FsHtmlEditorConfig,
  MentionPlugin,
  RealtimePlugin,
  ScreenRecordPlugin,
} from '@firestitch/html-editor';
import { FsMessage } from '@firestitch/message';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogComponent } from '../dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorComponent as FsHtmlEditorComponent_1 } from '../../../../src/app/modules/html-editor/components/html-editor/html-editor.component';
import { FsHtmlEditorContainerDirective } from '../../../../src/app/modules/html-editor/directives/html-editor-container.directive';
import { NgTemplateOutlet } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FsHtmlRendererComponent } from '../../../../src/app/modules/html-renderer/components/html-renderer/html-renderer.component';


@Component({
    selector: 'kitchen-sink',
    templateUrl: './kitchen-sink.component.html',
    styleUrls: ['./kitchen-sink.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsHtmlEditorComponent_1,
        FsHtmlEditorContainerDirective,
        NgTemplateOutlet,
        MatButton,
        FsHtmlRendererComponent,
    ],
})
export class KitchenSinkComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent) 
  public htmlEditor: FsHtmlEditorComponent;

  @ViewChild(FsHtmlEditorComponent, { read: ElementRef }) 
  public htmlEditorEl: ElementRef;

  public config: FsHtmlEditorConfig;
  public default = '<h1>This is 1st level heading</h1><p>This is a test paragraph.</p><h2>This is 2nd level heading</h2><p>This is a test paragraph.</p><h3>This is 3rd level heading</h3><p>This is a test paragraph.</p><h4>This is 4th level heading</h4><p>This is a test paragraph.</p><h1>Table</h1><table class="fr-alternate-rows" style="width: 100%;"><thead><tr><th>Heading 1</th><th>Heading 2&nbsp;</th><th>Heading 3</th></tr></thead><tbody><tr><td style="width: 33.3333%;">Text</td><td style="width: 33.3333%;">50</td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">Alt Text</td><td style="width: 33.3333%;">466</td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">Text</td><td style="width: 33.3333%;">9000</td><td style="width: 33.3333%;"><br></td></tr></tbody></table><h1>Blockquote</h1><blockquote>This is a block quotation containing a single paragraph. Well, not quite, since this is not <em>really</em> quoted text, but I hope you understand the point.After all, this page does not use HTML markup very normally anyway.</blockquote><h1>Code</h1><p class="code">function hello() {<br>&nbsp; alert("Hello");<br>}</p><h1>Lists</h1><p>This is a paragraph before an <strong>&nbsp;unnumbered&nbsp;</strong> list (ul).Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet.You can\'t guess which paragraphs are logically related to a list, e.g. as a "list header".</p><ul><li>One.</li><li>Two.</li><li>Three. Well, probably this list item should be longer. Note that for short items lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li><li>Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li></ul><p><br></p><ol><li>One.</li><li>Two.</li><li>Three. Well, probably this list item should be longer so that it will probably wrap to the next line in rendering.</li><li>This is a paragraph before a <strong style="outline: 0px;">numbered</strong>list (ol). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can\'t guess which paragraphs are logically related to a list, e.g.as a "list header".<ol><li>One.</li><li>Two.</li><li>Three.Well, probably this list item should be longer.Note that if items are short, lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li><li>Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li></ol></li></ol><h1>Styles</h1><ul><li><strong style="outline: 0px;">&amp; nbsp; bolded&nbsp;</strong>&nbsp;</li><li><u style="outline: 0px;">&nbsp;underlined&nbsp;</u></li><li><em style="outline: 0px;">&nbsp;italic&nbsp;</em></li><li><s style="outline: 0px;">&nbsp;strikethrough&nbsp;</s></li></ul><h1>Checklist</h1><ul class="checklist"><li>Do this</li><li class="checked">Do that<ul><li class="checked">Do something else</li><li class="checked">Do another thing</li></ul></li></ul><h1>Link</h1> <a href="https://en.wikipedia.org/wiki/Puppy">https://en.wikipedia.org/wiki/Puppy</a><br><img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg"><br><img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Cara_de_quem_caiu_do_caminh%C3%A3o..._%28cropped%29.jpg">';

  //public default = '<h1>This is 1st level heading</h1>
  public apiUrl = 'https://specify.firestitch.dev/api/';
  public html = this.default;
  public width;

  constructor(
    private _message: FsMessage,
    private _api: FsApi,
    private _renderer: Renderer2,
    private _dialog: MatDialog,
  ) {
  }

  public ngOnInit() {
    this.config = {
      padless: true,
      hint: 'Hint text',
      disabled: false,
      initOnClick: false,
      initClick: () => {
        //event.preventDefault();
      },
      placeholder: 'Placeholder...',
      label: 'Html Editor',
      image: {
        upload: (file: Blob) => {
          const data = {
            file: file,
          };

          return this._api.post(`${this.apiUrl}dummy/upload`, data)
            .pipe(
              map((response) => response.data.url),
            );
        },
      },
      plugins: [
        new RealtimePlugin(),
        new ScreenRecordPlugin({
          maxWidth: '800px',
          upload: () => {
            return of('http://dl5.webmfiles.org/big-buck-bunny_trailer.webm');
          },
        }),
        new CodePlugin(),
        new ChecklistPlugin(),
        new MentionPlugin({
          trigger: '@',
          name: 'accountMention',
          tooltip: 'Insert Mention',
          iconPath: 'M23,10c-0.3-2.9-1.8-5.4-4.3-7.2C16.1,1,12.7,0.2,9.6,0.9C6.6,1.6,4,3.5,2.5,6.1c-1.6,2.6-2,5.8-1.1,8.7c0.5,1.6,1.3,3,2.3,4.2c1.1,1.2,2.4,2.2,3.9,2.8c1.4,0.6,2.8,0.9,4.3,0.9c2,0,4-0.5,5.7-1.6l-1.2-2c-2.4,1.4-5.3,1.6-7.9,0.6c-2.4-1-4.2-3.1-4.9-5.5C3,11.9,3.3,9.4,4.6,7.3c1.2-2.1,3.2-3.6,5.5-4.1c2.4-0.5,5.1,0,7.2,1.6c1.9,1.4,3.1,3.3,3.3,5.5c0.1,1.4,0,2.5-0.4,3.3c-0.8,1.6-2.1,1.7-2.6,1.6c0,0,0,0,0,0c-0.1-0.2-0.1-1-0.1-1.4c0-0.1,0-0.3,0-0.4V6.8h-1.8c-0.2-0.2-0.5-0.4-0.7-0.5c-1-0.6-2.2-0.9-3.3-0.9C9.9,5.4,8.3,6,7.1,7.2c-1.9,1.8-2.5,4.7-1.4,7.1C6.2,15.4,7,16.4,8.1,17c1,0.6,2.2,0.9,3.5,0.9c1.4,0,2.7-0.4,3.8-1.1c0.1-0.1,0.2-0.2,0.3-0.2c0.4,0.5,0.9,0.8,1.6,0.9c0.9,0.1,1.9,0,2.7-0.4c1-0.5,1.7-1.3,2.3-2.4C23,13.4,23.2,11.9,23,10z M15.1,13.8C15,13.8,15,13.9,14.9,14c0,0-0.1,0.1-0.1,0.1c-0.2,0.3-0.5,0.6-0.8,0.8c-0.7,0.5-1.5,0.7-2.4,0.7c-1.7,0-3.1-0.9-3.7-2.3C7.2,11.8,7.6,10,8.7,8.9c0.7-0.7,1.8-1.1,2.9-1.1c0.8,0,1.5,0.2,2.1,0.6c0.4,0.2,0.8,0.5,1,0.9c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.2,0.3L15.1,13.8L15.1,13.8z',
          menuItemTemplate: (account) => {
            return `<span class="mention-account-menu-item">${account.name}</span>`;
          },
          selectedTemplate: (account) => {
            return `<span data-mention="account" data-account-id="${account.id}" data-ref="${guid('xxxxxxxx')}">@${account.name}</span>`;
          },
          fetch: (keyword) => {
            if(keyword.length > 5) {
              return of([]);
            }

            return this._api.get(`${this.apiUrl}dummy`, { keyword })
              .pipe(
                map((response) => response.objects),
              );
          },
          selected: (item) => {
            console.log(item);
          },
        }),
        new MentionPlugin({
          name: 'relateMention',
          tooltip: 'Insert Related',
          iconPath: 'M16.2,15.3c-0.8,0-1.5,0.3-2,0.8l-7.3-4.2C7,11.7,7,11.4,7,11.2s0-0.5-0.1-0.7l7.2-4.2c0.5,0.5,1.3,0.8,2.1,0.8c1.7,0,3.1-1.4,3.1-3.1S17.8,1,16.2,1c-1.7,0-3.1,1.4-3.1,3.1c0,0.2,0,0.5,0.1,0.7L6,8.9C5.5,8.4,4.7,8.1,3.9,8.1c-1.7,0-3.1,1.4-3.1,3.1s1.4,3.1,3.1,3.1c0.8,0,1.5-0.3,2.1-0.8l7.3,4.2c-0.1,0.2-0.1,0.4-0.1,0.7c0,1.6,1.3,3,3,3c1.6,0,3-1.3,3-3C19.1,16.7,17.8,15.3,16.2,15.3z',
          trigger: '~',
          menuItemTemplate: (object) => {
            return `<span class="mention-object-menu-item">${object.group.name}: ${object.name}</span>`;
          },
          selectedTemplate: (object) => {
            return `<span data-mention="object" data-object-id="${object.id}" data-ref="${guid('xxxxxxxx')}">${object.group.name}: ${object.name}</span>`;
          },
          fetch: (keyword) => {
            return this._api.get(`${this.apiUrl}dummy`, { keyword })
              .pipe(
                map((response) => response.objects),
              );
          },
          selected: (item) => {
            console.log(item);
          },
        }),
      ],
      toolbar: {
        text: {
          prepend: [
            {
              name: 'send',
              html: '<div class="send-test-button"><mat-icon class="material-icons">send</mat-icon>Send Test</div>',
              click: () => {
                console.log('Send clicked');
              },
            },
          ],
        },
        rich: {
          prepend: [
            'relateMention',
            'accountMention',
            {
              name: 'pageBreak',
              html: '<div class="send-test-button"><mat-icon class="material-icons">settings</mat-icon></div>',
              title: 'Insert Page Break',
              click: (editor) => {
                editor.html.insert('<div contenteditable="false" class="page-break"></div>', true);
              },
            },
          ],
        },
      },
    };
  }

  public save = () => {
    this._message.success('Saved Changes');

    return of(true);
  };

  public change(content) {
    console.log('Change', content);
  }

  public openInDialog() {
    this._dialog.open(DialogComponent);
  }

  public clear = () => {
    this.htmlEditor.clear();
    this.html = '';
  };

  public updateSize() {
    this.width = this.width ? null : '600px';
    this._renderer.setStyle(this.htmlEditorEl.nativeElement, 'width', this.width);
    this.htmlEditor.updateSize();
  }

  public setHtml = () => {
    this.htmlEditor.setHtml(this.default);
  };

  public focus = () => {
    this.htmlEditor.focus();
  };

  public disable = () => {
    this.htmlEditor.disable();
  };

  public unitialize() {
    this.htmlEditor.uninitialize();
  }

  public destroy() {
    if (!this.htmlEditor.hasContent()) {
      this._message.error('Cannot destroy because there is no content');
    } else {
      this.htmlEditor.destroy();
    }
  }

}
