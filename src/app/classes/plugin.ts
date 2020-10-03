import { FroalaEditor } from 'froala-editor';
import { PluginConfig } from './../interfaces/plugin-config';

export class Plugin {

  public config: PluginConfig;
  public editor: FroalaEditor;

  public initialize() {}
  public destroy() {}

}
