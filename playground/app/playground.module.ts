import { FsApiModule } from '@firestitch/api';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsFormModule } from '@firestitch/form';
import { FsScrollbarModule } from '@firestitch/scrollbar';
import { FsDialogModule } from '@firestitch/dialog';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  KitchenSinkComponent,
  ExamplesComponent,
  DialogComponent,
} from './components';
import { AppComponent } from './app.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

// import 'froala-editor/js/plugins/align.min.js';
// import 'froala-editor/js/plugins/colors.min.js';
// import 'froala-editor/js/plugins/image.min.js';
// import 'froala-editor/js/plugins/link.min.js';
// import 'froala-editor/js/plugins/lists.min.js';
// import 'froala-editor/js/plugins/paragraph_format.min.js';
// import 'froala-editor/js/plugins/table.min.js';
// import 'froala-editor/js/plugins/url.min.js';
// import 'froala-editor/js/plugins/video.min.js';
// import 'froala-editor/js/plugins/quote.min.js';


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    MatDialogModule,
    FsHtmlEditorModule.forRoot({
      activationKey: 'DUA2yE1G2E1A5B5B3pZGCTRSAPJWTLPLZHTQQe1JGZxC4B3A3C2B5A1C2E4F1A1==',
      froalaConfig: { },
    }),
    BrowserAnimationsModule,
    FsScrollbarModule.forRoot(),
    AppMaterialModule,
    FormsModule,
    CommonModule,
    FsLabelModule,
    FsFormModule,
    FsDialogModule,
    FsExampleModule.forRoot(),
    FsApiModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    DialogComponent,
    KitchenSinkConfigureComponent
  ],
})
export class PlaygroundModule {
}
