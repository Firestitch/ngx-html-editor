import { PluginConfig } from './../interfaces/plugin-config';
import { Plugin } from '../classes/plugin';

export class AlignPlugin extends Plugin {

  public constructor(public config: PluginConfig = { name: 'align' }) {
    super();
  }

  public initialize() {

  }

}
