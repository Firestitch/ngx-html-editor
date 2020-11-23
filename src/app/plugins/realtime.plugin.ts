import { PluginConfig } from '../interfaces/plugin-config';

import { Plugin } from '../classes/plugin';


export class RealtimePlugin extends Plugin {

  public constructor(public config: PluginConfig = { name: 'realtime' }) {
    super();
    this.config = {
      ...config,
      name: 'realtime',
    };
  }

  public initialize() {

    this.editor.events.on('click', (e) => {

    }, false);
  }
}
