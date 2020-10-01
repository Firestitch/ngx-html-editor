
import { Plugin } from "../classes/plugin";
import { ScreenRecordPluginConfig } from "./configs";

declare var MediaRecorder: any;

export class ScreenRecordPlugin extends Plugin {

  public constructor(public config: ScreenRecordPluginConfig = {}) {
    super();
    this.config = {
      ...config,
      name: config.name || 'screenRecord',
      buttons: [
        {
          name: 'screenRecord',
          svgPath: `M14.7,7.7v6.1H7.1V7.7H14.7 M16.3,9.6V6.9c0-0.4-0.3-0.8-0.8-0.8H6.4c-0.4,0-0.8,0.3-0.8,0.8v7.6c0,0.4,0.3,0.8,0.8,0.8h9.1c0.4,0,0.8-0.3,0.8-0.8v-2.7l1.7,1.7c0.3,0.3,0.8,0.3,1.1,0c0.1-0.1,0.2-0.3,0.2-0.5V8.4c0-0.4-0.3-0.8-0.8-0.8
	c-0.2,0-0.4,0.1-0.5,0.2L16.3,9.6z M21.5,1.6H2.9c-0.7,0-1.3,0.7-1.3,1.6v14.6c0,0.9,0.6,1.6,1.3,1.6h7.6v1.1l-5,1c-0.2,0-0.4,0.3-0.4,0.6c0,0.3,0.2,0.4,0.4,0.4c0,0,0,0,0.1,0l5.3-1h2.6l5.3,1c0,0,0,0,0.1,0c0.2,0,0.4-0.2,0.4-0.4
  c0-0.3-0.1-0.6-0.4-0.6l-5-1v-1.1h7.6c0.7,0,1.3-0.7,1.3-1.6V3.2C22.9,2.3,22.3,1.6,21.5,1.6z M21.1,17.3H3.3V3.7h17.8L21.1,17.3L21.1,17.3z`,
          tooltip: 'Screen Record',
          click: (editor) => {
             (<any>navigator).mediaDevices.getDisplayMedia({ video: true })
              .then((stream) => {
                const chunks = [];
                const options = { mimeType: 'video/webm; codecs=vp9' };
                let mediaRecorder = new MediaRecorder(stream, options);

                stream.addEventListener('inactive', (e) => {
                  mediaRecorder.stop();
                  mediaRecorder = null;
                  stream.getTracks().forEach((track) => track.stop());
                  stream = null;

                  const blob = new Blob(chunks, { type: 'video/webm' });
                  config.upload(blob)
                  .subscribe((url) => {
                    editor.html.insert(`<video controls width="100%" style="max-width:${config.maxWidth}"><source src="${url}" type="video/webm"></video>`);
                  });
                });

                mediaRecorder.addEventListener('dataavailable', (event) => {
                  if (event.data && event.data.size > 0) {
                    chunks.push(event.data);
                  }
                });

                mediaRecorder.start(10);
              })
              .catch((e) => { });
          }
        }
      ]
    };
  }

}
