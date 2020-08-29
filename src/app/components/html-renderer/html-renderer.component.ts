import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'fs-html-renderer',
  templateUrl: 'html-renderer.component.html',
  styleUrls: ['html-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsHtmlRendererComponent {

  @Input('html') public set setHtml(html) {
    this.trustedHtml = this.sanitized.bypassSecurityTrustHtml(html);
  }

  public trustedHtml: SafeHtml;

  public constructor(private sanitized: DomSanitizer) {}

}
