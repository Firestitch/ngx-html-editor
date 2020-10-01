import { PluginConfig } from './../interfaces/plugin-config';

export class Plugin {

  public config: PluginConfig;

  public initialize(editor) {}
  public destroy(editor) {}

}
