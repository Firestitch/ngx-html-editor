import { Plugin } from '../classes/plugin';

import { PluginConfig } from './../interfaces/plugin-config';

export class AlignPlugin extends Plugin {

  constructor(public config: PluginConfig = { name: 'align' }) {
    super();
  }

  public initialize() {

  }

}
