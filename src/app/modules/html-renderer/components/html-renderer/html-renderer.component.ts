import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';

import { FsFroalaLoaderService } from '../../../html-editor/services/froala-loader.service';


@Component({
  selector: 'fs-html-renderer',
  templateUrl: 'html-renderer.component.html',
  styleUrls: ['html-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FsHtmlRendererComponent {
  public readonly html = input<string | null | undefined>('');

  // Written in the editor, so shown as it stands
  public readonly trustedHtml = computed(() => this._sanitizer.bypassSecurityTrustHtml(this.html() || ''));

  private _sanitizer = inject(DomSanitizer);
  private _froalaLoader = inject(FsFroalaLoaderService);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._init();
  }

  // Froala's content styles lay out the HTML (images, videos, tables); its editor never loads here
  private _init(): void {
    this._froalaLoader.loadStyles()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
