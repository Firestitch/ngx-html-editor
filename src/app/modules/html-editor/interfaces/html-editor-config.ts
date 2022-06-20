import { Observable } from 'rxjs';

import { Plugin } from '../classes/plugin';
import { FroalaPlugin } from '../enums/default-plugin.enum';


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
  disabled?: boolean;
  activationKey?: any;
  tooltip?: string;
  plugins?: Plugin[];
  froalaPlugins?: FroalaPlugin[];
  froalaConfig?: any;
  assetsJSPath?: string;
  assetsCSSPath?: string;
  buttons?: {
    name: string;
    svgKey?: string;
    title?: string;
    focus?: boolean;
    undo?: boolean;
    refreshAfterCallback?: boolean;
    click: (editor: any) => void;
  }[];
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
