import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
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

  public config: FsHtmlEditorConfig;
  public content = '';

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
    console.log(content);
  }
}
