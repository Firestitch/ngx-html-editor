import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { FsApiModule } from '@firestitch/api';
import { FsDialogModule } from '@firestitch/dialog';
import { FsExampleModule } from '@firestitch/example';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule, FsHtmlRendererModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsScrollbarModule } from '@firestitch/scrollbar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  DialogComponent,
  ExamplesComponent,
  KitchenSinkComponent,
} from './components';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    MatDialogModule,
    FsHtmlEditorModule.forRoot({
      activationKey: '2J1B10dD7F6F5A3F3I3cWHNGGDTCWHId1Eb1Oc1Yh1b2Ld1POkE3D3F3C9A4E5A3G3B2G2==',
      froalaConfig: {},
    }),
    FsHtmlRendererModule,
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
    RouterModule.forRoot(routes, {}),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    DialogComponent,
    KitchenSinkConfigureComponent,
  ],
})
export class PlaygroundModule {
}
