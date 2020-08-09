import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsHtmlEditorComponent } from './components/html-editor/html-editor.component';
import { FsHtmlRendererComponent } from './components/html-renderer/html-renderer.component';

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
  static forRoot(): ModuleWithProviders<FsHtmlEditorModule> {
    return {
      ngModule: FsHtmlEditorModule,
    };
  }
}
