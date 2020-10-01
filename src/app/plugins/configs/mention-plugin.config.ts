import { PluginConfig } from './../../interfaces/plugin-config';
import { Observable } from 'rxjs';

export interface MentionPluginConfig extends PluginConfig {
  trigger?: string;
  menuItemTemplate?: (data: any) => string;
  selectedTemplate?: (data: any) => string;
  fetch: (keyord?: string) => Observable<any>;
  containerClass?: string;
  menuItemClass?: string;
  tooltip?: string;
  iconPath?: string;
}
