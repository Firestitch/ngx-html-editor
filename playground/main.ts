import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FsScrollbarModule } from '@firestitch/scrollbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FsLabelModule } from '@firestitch/label';
import { FsFormModule } from '@firestitch/form';
import { FsDialogModule } from '@firestitch/dialog';
import { FsExampleModule } from '@firestitch/example';
import { FsApiModule } from '@firestitch/api';
import { FsMessageModule } from '@firestitch/message';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, MatDialogModule, FsHtmlEditorModule.forRoot({
            activationKey: '2J1B10dD7F6F5A3F3I3cWHNGGDTCWHId1Eb1Oc1Yh1b2Ld1POkE3D3F3C9A4E5A3G3B2G2==',
            froalaConfig: {},
        }), FsScrollbarModule.forRoot(), FormsModule, CommonModule, FsLabelModule, FsFormModule, FsDialogModule, FsExampleModule.forRoot(), FsApiModule.forRoot(), FsMessageModule.forRoot()),
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

