import { Observable } from 'rxjs';

export interface FsHtmlEditorConfig {
  image?: FsHtmlEditorUploadConfig;
  label?: string;
  hint?: string;
  change?: Function;
  initOnClick?: boolean;
  placeholder?: string;
  maxLength?: number;
  autofocus?: boolean;
  froalaConfig?: any;
  activationKey?: any;
}

export interface FsHtmlEditorUploadConfig {
  upload?: (file: Blob) => Observable<string>;
}
