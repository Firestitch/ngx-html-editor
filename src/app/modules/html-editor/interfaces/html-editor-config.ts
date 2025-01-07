import { Observable } from 'rxjs';

import { Plugin } from '../classes/plugin';
import { FroalaPlugin } from '../enums/default-plugin.enum';

import { ToolbarButton } from './toolbar-button';


export interface FsHtmlEditorConfig {
  image?: FsHtmlEditorUploadConfig;
  label?: string;
  hint?: string;
  change?: (data?) => void;
  initOnClick?: boolean;
  initClick?: (event?: UIEvent) => void;
  placeholder?: string;
  maxLength?: number;
  autofocus?: boolean;
  disabled?: boolean;
  activationKey?: any;
  tooltip?: string;
  plugins?: Plugin[];
  padless?: boolean;
  froalaPlugins?: FroalaPlugin[];
  froalaConfig?: any;
  assetsJSPath?: string;
  assetsCSSPath?: string;
  prependToolbarTextButtons?: ToolbarButton[],
  buttons?: ToolbarButton[];
}

export interface FsHtmlEditorUploadConfig {
  width?: number | undefined;
  height?: number | undefined;
  quality?: number | undefined;
  format?: string | undefined;
  minWidth?: number;
  minHeight?: number;
  upload?: (file: Blob) => Observable<string>;
}
