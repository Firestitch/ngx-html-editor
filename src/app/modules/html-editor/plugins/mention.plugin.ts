import { debounce } from 'lodash-es';
import Tribute, { TributeItem } from 'tributejs';

import { MentionPluginConfig } from './configs/mention-plugin.config';

import { Plugin } from '../classes/plugin';

import { guid } from '@firestitch/common';


export class MentionPlugin extends Plugin {

  private static _currentGuid = null;
  private static _tributes = [];
  private _tribute;
  private _guid = guid();

  public constructor(public config: MentionPluginConfig) {
    super();
    this.config = {
      ...config,
      buttons: [
        {
          name: config.name,
          tooltip: config.tooltip,
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

  public initialize() {
    this._tribute.attach(this.editor.el);
    this.editor.events.on('keydown', (e) => {
      if (e.key === 'Enter' &&  this._tribute.isActive) {
        return false;
      }
    }, true);

    
    this.editor.el.addEventListener("tribute-replaced", this.selected);
  }

  public selected = (event) => {
    if(this.config.selected) {
      if(MentionPlugin._currentGuid === this._guid) {
        this.config.selected(event.detail.item.original);
      }
    }
  }

  public destroy() {
    this.editor.el.removeEventListener("tribute-replaced", this.selected);
  }

  private _closeAll() {
    MentionPlugin._tributes.forEach((tribute) => {
      if (tribute.menu) {
        tribute.hideMenu();
      }
    });
  }

  private _loadValues(keyword, cb) {
    MentionPlugin._currentGuid = this._guid;
    return this.config.fetch(keyword)
              .subscribe((data) => {
                cb(data);
              });
  }
}
