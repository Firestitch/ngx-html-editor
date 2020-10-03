import { PluginConfig } from './../interfaces/plugin-config';

import { Plugin } from "../classes/plugin";

export class ChecklistPlugin extends Plugin {

  public constructor(public config: PluginConfig = { name: 'checklist' }) {
    super();
    this.config = {
      ...config,
      name: 'checklist',
      buttons: [
        {
          name: 'checklist',
          svgPath: 'M8.4,10.3l-1.2,1.2l4,4L20,6.7l-1.2-1.2l-7.6,7.6L8.4,10.3z M18.2,18.2H5.8V5.8h8.9V4H5.8C4.8,4,4,4.8,4,5.8v12.4c0,1,0.8,1.8,1.8,1.8h12.4c1,0,1.8-0.8,1.8-1.8v-7.1h-1.8V18.2z',
          click: (editor) => {
            editor.html.insert('<ul class="checklist"><li></li></ul>');
          }
        }
      ]
    };
  }

  public initialize() {
    this.editor.events.on('click', (e) => {
      const li = e.target;
      if (li.nodeName === 'LI' && e.offsetX < 0) {

        const items = [li, ...li.querySelectorAll('li')];

        if (li.classList.contains('checked')) {
          items.forEach((item) => {
            item.classList.remove('checked');
          });
        } else {
          items.forEach((item) => {
            item.classList.add('checked');
          });
        }
      }

    }, false);
  }

}
