import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsHtmlRendererComponent } from './components/html-renderer/html-renderer.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsHtmlRendererComponent,
  ],
  declarations: [
    FsHtmlRendererComponent,
  ],
})
export class FsHtmlRendererModule {
}
