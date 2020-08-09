import { FsHtmlEditorComponent } from './../../../../src/app/components/html-editor/html-editor.component';
import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';
import { FsHtmlEditorConfig } from './../../../../src/app/interfaces';


@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent implements OnInit {

  @ViewChild(FsHtmlEditorComponent) public htmlEditor: FsHtmlEditorComponent;

  public config: FsHtmlEditorConfig;
  public default = `<h1>This is 1st level heading</h1><p>This is a test paragraph.</p><h2>This is 2nd level heading</h2><p>This is a test paragraph.</p><h3>This is 3rd level heading</h3><p>This is a test paragraph.</p><h4>This is 4th level heading</h4><p>This is a test paragraph.</p><h1>Table</h1><table class="fr-alternate-rows" style="width: 100%;"><thead><tr><th>Heading 1</th><th>Heading 2&nbsp;</th><th>Heading 3</th></tr></thead><tbody><tr><td style="width: 33.3333%;">Text</td><td style="width: 33.3333%;">50</td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">Alt Text</td><td style="width: 33.3333%;">466</td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;">Text</td><td style="width: 33.3333%;">9000</td><td style="width: 33.3333%;"><br></td></tr></tbody></table><h1>Blockquote</h1><blockquote>This is a block quotation containing a single paragraph. Well, not quite, since this is not <em>really</em> quoted text, but I hope you understand the point.After all, this page does not use HTML markup very normally anyway.</blockquote><h1>Code</h1><p><code>&nbsp;function hello() { alert("Hello"); } <br></code></p><h1>Lists</h1><p>This is a paragraph before an <strong>&nbsp;unnumbered&nbsp;</strong> list (ul).Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet.You can't guess which paragraphs are logically related to a list, e.g. as a "list header".</p><ul><li>One.</li><li>Two.</li><li>Three. Well, probably this list item should be longer. Note that for short items lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li><li>Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li></ul><p><br></p><ol><li>One.</li><li>Two.</li><li>Three. Well, probably this list item should be longer so that it will probably wrap to the next line in rendering.</li><li>This is a paragraph before a <strong style="outline: 0px;">numbered</strong>list (ol). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can't guess which paragraphs are logically related to a list, e.g.as a "list header".<ol><li>One.</li><li>Two.</li><li>Three.Well, probably this list item should be longer.Note that if items are short, lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items.</li><li>Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it.</li></ol></li></ol><h1>Styles</h1><ul><li><strong style="outline: 0px;">&amp; nbsp; bolded&nbsp;</strong>&nbsp;</li><li><u style="outline: 0px;">&nbsp;underlined&nbsp;</u></li><li><em style="outline: 0px;">&nbsp;italic&nbsp;</em></li><li><s style="outline: 0px;">&nbsp;strikethrough&nbsp;</s><br></li></ul><h1>Checklist</h1><ul class="checklist"><li>Do this</li><li class="checked">Do that<ul><li class="checked">Do something else</li><li class="checked">Do another thing</li></ul></li></ul>`;
  public html = this.default;

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    private _message: FsMessage,
    private _api: FsApi,
  ) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }

  public ngOnInit() {
    this.config = {
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

  public setHtml = () => {
    this.htmlEditor.setHtml(this.default);
  }

  public focus = () => {
    this.htmlEditor.focus();
  }

  public disable = () => {
    this.htmlEditor.disable();
  }

}
