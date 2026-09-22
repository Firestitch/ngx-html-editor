import { Observable } from 'rxjs';


import { FroalaOptions } from 'froala-editor';

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
  // Floating: no fixed toolbar and no frame. The toolbar pops up over the text
  // while it is being edited (Froala's inline toolbar), so the editor can sit in
  // place of the content it edits — a text box on a canvas. Pair it with no
  // `label` so no form field is drawn around it.
  floating?: boolean;
  froalaPlugins?: FroalaPlugin[];
  froalaConfig?:  Partial<FroalaOptions>;
  assetsJSPath?: string;
  assetsCSSPath?: string;
  buttons?: ToolbarButton[];
  initialized?: () => void;
  toolbar?: {
    text?: {
      prepend?: (string | ToolbarButton)[];
    },
    paragraph?: {
      prepend?: (string | ToolbarButton)[];
    },
    rich?: {
      prepend?: (string | ToolbarButton)[];
    },
  }
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
