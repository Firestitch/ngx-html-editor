import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';



import { FsHtmlEditorComponent } from './components/html-editor/html-editor.component';
import { FsHtmlEditorContainerDirective } from './directives';
import { FroalaPlugin } from './enums/default-plugin.enum';
import { FS_HTML_EDITOR_CONFIG, FS_HTML_EDITOR_DEFAULT_CONFIG } from './injects/config.inject';
import { FsHtmlEditorConfig } from './interfaces/html-editor-config';


@NgModule({
    imports: [
    CommonModule,
    FsSkeletonModule,
    FsLabelModule,
    FsHtmlEditorComponent,
    FsHtmlEditorContainerDirective,
],
    exports: [
        FsHtmlEditorComponent,
        FsHtmlEditorContainerDirective,
    ],
})
export class FsHtmlEditorModule {
  public static forRoot(config: FsHtmlEditorConfig = {}): ModuleWithProviders<FsHtmlEditorModule> {
    return {
      ngModule: FsHtmlEditorModule,
      providers: [
        { provide: FS_HTML_EDITOR_DEFAULT_CONFIG, useValue: config },
        {
          provide: FS_HTML_EDITOR_CONFIG,
          useFactory: htmlEditorConfigFactory,
          deps: [FS_HTML_EDITOR_DEFAULT_CONFIG],
        },
      ],
    };
  }
}

export function htmlEditorConfigFactory(config: FsHtmlEditorConfig) {
  return {
    froalaPlugins: [
      FroalaPlugin.Align,
      FroalaPlugin.Colors,
      FroalaPlugin.Image,
      FroalaPlugin.Link,
      FroalaPlugin.Lists,
      FroalaPlugin.ParagraphFormat,
      FroalaPlugin.Quote,
      FroalaPlugin.Table,
      FroalaPlugin.Url,
      FroalaPlugin.Video,
      FroalaPlugin.Draggable,
      FroalaPlugin.FontSize,
      FroalaPlugin.LineHeight,
    ],
    ...config,
  };
}
