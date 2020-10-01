import { MentionPluginConfig } from './configs/mention-plugin.config';
import Tribute, { TributeItem } from 'tributejs';

import { Plugin } from "../classes/plugin";
import { debounce } from 'lodash-es';

export class MentionPlugin extends Plugin {

  private static _tributes = [];
  private _tribute;

  public constructor(public config: MentionPluginConfig) {
    super();
    this.config = {
      ...config,
      buttons: [
        {
          name: config.name,
          svgPath: config.iconPath,
          click: (editor) => {
            this._closeAll();
            this._tribute.showMenuForCollection(editor.el);
          }
        }
      ]
    };

    this._tribute = new Tribute({
        values: debounce(this._loadValues.bind(this), 200),
        searchOpts: {
          pre: '',
          post: '',
          skip: true
        },
        containerClass: `fs-html-editor-mention-container ${this.config.containerClass || ''}`,
        itemClass: `fs-html-editor-mention-menu-item ${this.config.menuItemClass || ''}`,
        trigger: this.config.trigger,
        allowSpaces: true,
        menuItemTemplate: (item: TributeItem<any>) => {
          return this.config.menuItemTemplate(item.original);
        },
        selectTemplate: (item: TributeItem<any>) => {
          const template = this.config.selectedTemplate(item.original);

          let p = document.createElement('p');
          p.innerHTML = template;

          let node = p.firstElementChild;
          if (!node) {
            node = document.createElement('span');
            node.innerHTML = template;
          }

          node.setAttribute('contenteditable', 'false');
          node.classList.add('fr-deletable');

          return node.outerHTML;
        },
      });

    MentionPlugin._tributes.push(this._tribute);
  }

  public initialize(editor) {
    this._tribute.attach(editor.el);
    editor.events.on('keydown', (e) => {
      if (e.key === 'Enter' &&  this._tribute.isActive) {
        return false;
      }
    }, true);
  }

  public destroy() {}

  private _closeAll() {
    MentionPlugin._tributes.forEach((tribute) => {
      if (tribute.menu) {
        tribute.hideMenu();
      }
    });
  }

  private _loadValues(keyword, cb) {
    return this.config.fetch(keyword)
              .subscribe((data) => {
                cb(data);
              });
  }
}
