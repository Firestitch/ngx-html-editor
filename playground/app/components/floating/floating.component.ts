import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { FsHtmlEditorComponent, FsHtmlEditorConfig } from '@firestitch/html-editor';

import { FsHtmlRendererComponent } from '../../../../src/app/modules/html-renderer/components/html-renderer/html-renderer.component';


@Component({
  selector: 'floating',
  templateUrl: './floating.component.html',
  styleUrls: ['./floating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    FsHtmlEditorComponent,
    FsHtmlRendererComponent,
  ],
})
export class FloatingComponent {

  public title = '<p>Quarterly Review</p>';
  public body = '<p>Click any text on the canvas to edit it. The toolbar pops up over the text instead of sitting above a framed field.</p>';
  public zoom = 1;

  public titleConfig: FsHtmlEditorConfig = this._createConfig('Title');
  public bodyConfig: FsHtmlEditorConfig = this._createConfig('Type something...');

  public toggleZoom(): void {
    this.zoom = this.zoom === 1 ? 0.75 : 1;
  }

  private _createConfig(placeholder: string): FsHtmlEditorConfig {
    return {
      floating: true,
      placeholder,
      buttons: [
        {
          name: 'textPreset',
          title: 'Text Style',
          svgKey: 'paragraphStyle',
          options: {
            '48px': 'Headline',
            '28px': 'Subheading',
            '16px': 'Body',
          },
          click: (editor, value) => {
            editor.fontSize.apply(value);
          },
        },
      ],
      froalaConfig: {
        toolbarButtons: [
          'textPreset', 'fontFamily', 'fontSize', '|',
          'bold', 'italic', 'underline', 'textColor', '|',
          'align', 'formatUL', 'clearFormatting',
        ],
        fontFamily: {
          'Arial,Helvetica,sans-serif': 'Arial',
          'Georgia,serif': 'Georgia',
          '\'Courier New\',monospace': 'Courier New',
        },
      },
    };
  }

}
