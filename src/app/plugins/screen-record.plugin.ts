import FroalaEditor from 'froala-editor';
import { Plugin } from "../classes/plugin";
import { ScreenRecordPluginConfig } from "./configs/screen-record-plugin.config";

declare var MediaRecorder: any;

export class ScreenRecordPlugin extends Plugin {

  private _activeEl;

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
                    editor.html.insert(`<span class="fr-screen-record fr-deletable fr-draggable"><video controls style="max-width:${config.maxWidth}"><source src="${url}" type="video/webm"></video></span>`);
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

  public initialize() {

    this.editor.events.on('mouseup', (e) => {
      const el = this._getEl(e.target);

      if (el) {
        this.editor.popups.hideAll();
        this._activeEl = el;
        this._showPopup(el);
      }
    });

    FroalaEditor.POPUP_TEMPLATES["screenRecordPlugin.popup"] = '[_BUTTONS_]';

    FroalaEditor.DefineIcon('popupClose', { NAME: 'trash', SVG_KEY: 'remove' });
    FroalaEditor.RegisterCommand('popupClose', {
      title: 'Remove',
      undo: false,
      focus: false,
      callback: () => {
        if (this._activeEl) {
          this._activeEl.remove();
        }
      }
    });
  }

  private _createPopup() {

    const template = {
      buttons: `<div class="fr-buttons">${this.editor.button.buildList(['popupClose'])}</div>`,
    };

    return this.editor.popups.create('screenRecordPlugin.popup', template);
  }

  private _showPopup (el) {
    var $popup = this.editor.popups.get('screenRecordPlugin.popup');

    if (!$popup) {
      $popup = this._createPopup();
    }

    this.editor.popups.setContainer('screenRecordPlugin.popup', this.editor.$(el));

    const left = el.offsetLeft + el.offsetWidth / 2;

    this.editor.popups.show('screenRecordPlugin.popup', left, null);
  }

  private _getEl(el) {

    if (el && el.classList) {
      if (el.classList.contains('fr-screen-record'))
        return el;

      return this._getEl(el.parentNode);
    }
  }
}
