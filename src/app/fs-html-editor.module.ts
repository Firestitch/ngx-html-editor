import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsHtmlEditorComponent } from './components/html-editor/html-editor.component';
import { FsHtmlRendererComponent } from './components/html-renderer/html-renderer.component';
import { FsHtmlEditorConfig } from './interfaces/html-editor-config';
import { FS_HTML_EDITOR_DEFAULT_CONFIG } from './injects/config.inject';
import { FS_HTML_EDITOR_CONFIG } from './injects/config.inject';

@NgModule({
  imports: [
    CommonModule,
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
        { provide: FS_HTML_EDITOR_CONFIG, useValue: config },
        {
          provide: FS_HTML_EDITOR_DEFAULT_CONFIG,
          useFactory: FsHtmlEditorConfigFactory,
          deps: [FS_HTML_EDITOR_CONFIG]
        }
      ]
    };
  }
}

export function FsHtmlEditorConfigFactory(config: FsHtmlEditorConfig) {
  return { ...config };
}
