import { PluginConfig } from '../../interfaces/plugin-config';
import { Observable } from 'rxjs';

export interface ScreenRecordPluginConfig extends PluginConfig {
  name?: string;
  maxWidth?: string,
  upload?: (file: Blob) => Observable<string>;
}
