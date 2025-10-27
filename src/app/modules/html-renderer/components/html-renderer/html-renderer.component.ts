import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FsFroalaLoaderService } from '../../../html-editor/services/froala-loader.service';


@Component({
    selector: 'fs-html-renderer',
    templateUrl: 'html-renderer.component.html',
    styleUrls: ['html-renderer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FsHtmlRendererComponent {

  @Input('html') public set setHtml(html) {
    this.trustedHtml = this.sanitized.bypassSecurityTrustHtml(html || '');
    this._cdRef.markForCheck();
  }

  public trustedHtml: SafeHtml;

  constructor(
    private sanitized: DomSanitizer,
    private _cdRef: ChangeDetectorRef,
    // Initial service call to load Froala css
    private _fr: FsFroalaLoaderService,
  ) { }

}
