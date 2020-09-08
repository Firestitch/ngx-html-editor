import { Observable } from 'rxjs';
import { MentionConfig } from './mention-config';

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
  mentions?: MentionConfig[],
  tooltip?: string;
}

export interface FsHtmlEditorUploadConfig {
  upload?: (file: Blob) => Observable<string>;
}
