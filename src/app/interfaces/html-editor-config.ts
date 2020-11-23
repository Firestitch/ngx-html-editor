import { Observable } from 'rxjs';

import { Plugin } from '../classes/plugin';
import { DefaultPlugin } from '../enums/default-plugin.enum';


export interface FsHtmlEditorConfig {
  image?: FsHtmlEditorUploadConfig;
  label?: string;
  hint?: string;
  change?: Function;
  initOnClick?: boolean;
  initClick?: (event?: UIEvent) => void;
  placeholder?: string;
  maxLength?: number;
  autofocus?: boolean;
  froalaConfig?: any;
  activationKey?: any;
  tooltip?: string;
  plugins?: Plugin[];
  defaultPlugins?: DefaultPlugin[];
}

export interface FsHtmlEditorUploadConfig {
  upload?: (file: Blob) => Observable<string>;
}
