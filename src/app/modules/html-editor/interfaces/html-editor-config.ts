import { Observable } from 'rxjs';


import * as FroalaEditor from 'froala-editor';

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
  froalaConfig?:  Partial<FroalaEditor.FroalaOptions>;
  assetsJSPath?: string;
  assetsCSSPath?: string;
  prependToolbarTextButtons?: ToolbarButton[],
  buttons?: ToolbarButton[];
  initialized?: () => void;
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
