import { FsApiModule } from '@firestitch/api';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsComponentModule } from '@firestitch/package';
import { FsLabelModule } from '@firestitch/label';
import { FsFormModule } from '@firestitch/form';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  KitchenSinkComponent,
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsComponentModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    CommonModule,
    FsLabelModule,
    FsFormModule,
    FsExampleModule.forRoot(),
    FsApiModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    KitchenSinkConfigureComponent
  ],
})
export class PlaygroundModule {
}
