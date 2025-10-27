import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core';
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
  private sanitized = inject(DomSanitizer);
  private _cdRef = inject(ChangeDetectorRef);
  private _fr = inject(FsFroalaLoaderService);


  @Input('html') public set setHtml(html) {
    this.trustedHtml = this.sanitized.bypassSecurityTrustHtml(html || '');
    this._cdRef.markForCheck();
  }

  public trustedHtml: SafeHtml;

}
