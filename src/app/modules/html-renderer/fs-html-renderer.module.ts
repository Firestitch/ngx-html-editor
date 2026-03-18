import { NgModule } from '@angular/core';

import { FsHtmlRendererComponent } from './components/html-renderer/html-renderer.component';

@NgModule({
    imports: [
        FsHtmlRendererComponent,
    ],
    exports: [
        FsHtmlRendererComponent,
    ],
})
export class FsHtmlRendererModule {}
