import { Observable } from 'rxjs';

export interface MentionConfig {
  trigger?: string;
  menuItemTemplate?: (data: any) => string;
  selectedTemplate?: (data: any) => string;
  fetch: (keyord?: string) => Observable<any>;
  containerClass?: string;
  menuItemClass?: string;
  name: string;
  iconPath?: string;
  tooltip?: string;
}
