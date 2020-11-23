import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FsHtmlEditorComponent } from './components/html-editor/html-editor.component';
import { FsHtmlRendererComponent } from './components/html-renderer/html-renderer.component';
import { FsHtmlEditorConfig } from './interfaces/html-editor-config';
import { FS_HTML_EDITOR_CONFIG, FS_HTML_EDITOR_DEFAULT_CONFIG } from './injects/config.inject';
import { DefaultPlugin } from './enums/default-plugin.enum';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    FsHtmlEditorComponent,
    FsHtmlRendererComponent,
  ],
  declarations: [
    FsHtmlEditorComponent,
    FsHtmlRendererComponent,
  ],
})
export class FsHtmlEditorModule {
  static forRoot(config: FsHtmlEditorConfig = {}): ModuleWithProviders<FsHtmlEditorModule> {
    return {
      ngModule: FsHtmlEditorModule,
      providers: [
        { provide: FS_HTML_EDITOR_DEFAULT_CONFIG, useValue: config },
        {
          provide: FS_HTML_EDITOR_CONFIG,
          useFactory: FsHtmlEditorConfigFactory,
          deps: [FS_HTML_EDITOR_DEFAULT_CONFIG]
        }
      ]
    };
  }
}

export function FsHtmlEditorConfigFactory(config: FsHtmlEditorConfig) {
  return {
    defaultPlugins: [
      DefaultPlugin.Align,
      DefaultPlugin.Colors,
      DefaultPlugin.Image,
      DefaultPlugin.Link,
      DefaultPlugin.Lists,
      DefaultPlugin.ParagraphFormat,
      DefaultPlugin.Quote,
      DefaultPlugin.Table,
      DefaultPlugin.Url,
      DefaultPlugin.Video,
    ],
    ...config
  };
}
