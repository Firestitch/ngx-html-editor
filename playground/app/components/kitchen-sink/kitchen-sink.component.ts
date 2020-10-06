import { FsHtmlEditorConfig } from './../../../../src/app/interfaces/html-editor-config';
import { MentionPlugin } from './../../../../src/app/plugins/mention.plugin';
import { ChecklistPlugin } from './../../../../src/app/plugins/checklist.plugin';
import { ScreenRecordPlugin } from './../../../../src/app/plugins/screen-record.plugin';
import { RichButtons } from './../../../../src/app/consts/rich-buttons.const';
import { FsHtmlEditorComponent } from './../../../../src/app/components/html-editor/html-editor.component';
import { CodePlugin } from './../../../../src/app/plugins/code.plugin';
import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';
import { of } from 'rxjs';


@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent) public htmlEditor: FsHtmlEditorComponent;
  @ViewChild(FsHtmlEditorComponent, { read: ElementRef }) public htmlEditorEl: ElementRef;

  public config: FsHtmlEditorConfig;
  public default = `<h1>This is 1st level heading</h1><p>This is a test paragraph.</p><h2>This is 2nd level heading</h2><p>This is a test paragraph.</p><h3>This is 3rd level heading</h3><p>This is a test paragraph.</p><h4>This is 4th level heading</h4><p>This is a test paragraph.</p><h1>Table</h1><table class="fr-alternate-rows" style="width: 100%;"><thead><tr><th>Heading 1</th><th>Heading 2&nbsp;</th><th>Heading 3</th></tr></thead><tbody><tr><td style="width: 33.3333%;">Text</td><td style="width: 33.3333%;">50</td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">Alt Text</td><td style="width: 33.3333%;">466</td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">Text</td><td style="width: 33.3333%;">9000</td><td style="width: 33.3333%;"><br></td></tr></tbody></table><h1>Blockquote</h1><blockquote>This is a block quotation containing a single paragraph. Well, not quite, since this is not <em>really</em> quoted text, but I hope you understand the point.After all, this page does not use HTML markup very normally anyway.</blockquote><h1>Code</h1><p class="code">function hello() {<br>&nbsp; alert("Hello");<br>}</p><h1>Lists</h1><p>This is a paragraph before an <strong>&nbsp;unnumbered&nbsp;</strong> list (ul).Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet.You can't guess which paragraphs are logically related to a list, e.g. as a "list header".</p><ul><li>One.</li><li>Two.</li><li>Three. Well, probably this list item should be longer. Note that for short items lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li><li>Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li></ul><p><br></p><ol><li>One.</li><li>Two.</li><li>Three. Well, probably this list item should be longer so that it will probably wrap to the next line in rendering.</li><li>This is a paragraph before a <strong style="outline: 0px;">numbered</strong>list (ol). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can't guess which paragraphs are logically related to a list, e.g.as a "list header".<ol><li>One.</li><li>Two.</li><li>Three.Well, probably this list item should be longer.Note that if items are short, lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li><li>Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li></ol></li></ol><h1>Styles</h1><ul><li><strong style="outline: 0px;">&amp; nbsp; bolded&nbsp;</strong>&nbsp;</li><li><u style="outline: 0px;">&nbsp;underlined&nbsp;</u></li><li><em style="outline: 0px;">&nbsp;italic&nbsp;</em></li><li><s style="outline: 0px;">&nbsp;strikethrough&nbsp;</s></li></ul><h1>Checklist</h1><ul class="checklist"><li>Do this</li><li class="checked">Do that<ul><li class="checked">Do something else</li><li class="checked">Do another thing</li></ul></li></ul><h1>Link</h1> <a href="https://en.wikipedia.org/wiki/Puppy">https://en.wikipedia.org/wiki/Puppy</a>`;

  public html = this.default;
  public width;

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    private _message: FsMessage,
    private _api: FsApi,
    private renderer: Renderer2,
  ) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }

  public ngOnInit() {
    this.config = {
      froalaConfig: {
        toolbarButtons: {
          moreRich: {
            buttons: [ ...RichButtons, 'mention', 'screenRecord' ],
          }
        }
      },
      initOnClick: true,
      initClick: (event: UIEvent) => {
        //event.preventDefault();
      },
      placeholder: 'You Placeholder...',
      image: {
        upload: (file: Blob) => {
          const data = {
            file: file
          };
          return this._api.post('https://boilerplate.firestitch.com/api/dummy/upload', data)
            .pipe(
              map((response) => response.data.url),
            );
        }
      },
      plugins: [
        new ScreenRecordPlugin({
          maxWidth: '800px',
          upload: (file: Blob) => {
            return of('http://dl5.webmfiles.org/big-buck-bunny_trailer.webm');
          }
        }),
        new CodePlugin(),
        new ChecklistPlugin(),
        new MentionPlugin({
          trigger: '@',
          name: 'mention',
          tooltip: 'Mention',
          iconPath: `M16.2,15.3c-0.8,0-1.5,0.3-2,0.8l-7.3-4.2C7,11.7,7,11.4,7,11.2s0-0.5-0.1-0.7l7.2-4.2c0.5,0.5,1.3,0.8,2.1,0.8c1.7,0,3.1-1.4,3.1-3.1S17.8,1,16.2,1c-1.7,0-3.1,1.4-3.1,3.1c0,0.2,0,0.5,0.1,0.7L6,8.9C5.5,8.4,4.7,8.1,3.9,8.1c-1.7,0-3.1,1.4-3.1,3.1s1.4,3.1,3.1,3.1c0.8,0,1.5-0.3,2.1-0.8l7.3,4.2c-0.1,0.2-0.1,0.4-0.1,0.7c0,1.6,1.3,3,3,3c1.6,0,3-1.3,3-3C19.1,16.7,17.8,15.3,16.2,15.3z`,
          menuItemTemplate: (data) => {
            return `<span class="item">${data.name}</span>`;
          },
          selectedTemplate: (data) => {
            return `<span class="mention">@${data.name}</span>`;
          },
          fetch: (keyword) => {
            return this._api.get('https://boilerplate.firestitch.com/api/dummy', { keyword })
            .pipe(
              map((response) => response.data.objects),
            );
          },
        }),
      ],
    };
  }

  public save = () => {
    this._message.success('Saved Changes');
  }

  public change(content) {
    console.log('Change', content);
  }

  public clear = () => {
    this.htmlEditor.clear();
    this.html = '';
  }

  public updateSize() {
    this.width = this.width ? null : '600px';
    this.renderer.setStyle(this.htmlEditorEl.nativeElement, 'width', this.width);
    this.htmlEditor.updateSize();
  }

  public setHtml = () => {
    this.htmlEditor.setHtml(this.default);
  }

  public focus = () => {
    this.htmlEditor.focus();
  }

  public disable = () => {
    this.htmlEditor.disable();
  }

  public destroy() {

    if (!this.htmlEditor.hasContent()) {
      this.message.error('Cannot destroy because there is no content')
    } else {
      this.htmlEditor.destroy();
    }
  }

}
