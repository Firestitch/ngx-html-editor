import { PluginConfig } from './../interfaces/plugin-config';

import { Plugin } from "../classes/plugin";

export class CodePlugin extends Plugin {

  public constructor(public config: PluginConfig = { name: 'code' }) {
    super();
    this.config = {
      ...config,
      name: 'code',
      buttons: [
        {
          name: 'code',
          svgPath: 'M8.9,7.3L4.2,12l4.7,4.7l1.1-1.1L6.4,12L10,8.4L8.9,7.3z M15.1,7.3L14,8.4l3.6,3.6L14,15.6l1.1,1.1l4.7-4.7L15.1,7.3z',
          click: (editor) => {
            const node = editor.selection.get();
            const codeEl = this._getCodeEl(node.baseNode);
            if (codeEl) {
              codeEl.classList.remove('code');
            } else {
              editor.html.insert('<p class="code">' + editor.selection.get().toString().replace(/\n{1,}/g,'<br>') + '</p>');
            }
          }
        }
      ]
    };
  }

  public initialize(editor) {
    editor.events.on('keydown', (e) => {
      if (e.keyCode === 13) {
        const selection = editor.selection.get();

        if (selection && this._getCodeEl(selection.baseNode)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          let br = '<br>';
          const base = selection.baseNode;
          if (base.nodeName === '#text' && selection.baseOffset === base.length) {

            if (!(base.nextSibling && base.nextSibling.nodeName === 'BR')) {
              br += '<br>';
            }
          } else {
            const el: any = Array.from(base.childNodes).splice(selection.baseOffset - 1, 1).pop();
            if (el && el.nodeName !== 'BR') {
              br += '<br>';
            }
          }

          editor.html.insert(br);
          return false;
        }
      }
    }, true);
  }

  public destroy() {}

  private _getCodeEl(el) {

    if (el) {
      if (el.classList && el.classList.contains('code')) {
        return el;
      }

      if (el.parentElement) {
        return this._getCodeEl(el.parentElement);
      }
    }

    return null;
  }
}
