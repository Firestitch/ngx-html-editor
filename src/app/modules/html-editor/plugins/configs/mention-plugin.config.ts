import { Observable } from 'rxjs';

import { PluginConfig } from './../../interfaces/plugin-config';

export interface MentionPluginConfig extends PluginConfig {
  trigger?: string;
  menuItemTemplate?: (data: any) => string;
  selectedTemplate?: (data: any) => string;
  fetch: (keyword?: string) => Observable<any>;
  containerClass?: string;
  menuItemClass?: string;
  tooltip?: string;
  iconPath?: string;
  selected?: (item: any) => void;
}
