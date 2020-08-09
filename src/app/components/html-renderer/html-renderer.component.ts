import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fs-html-renderer',
  templateUrl: 'html-renderer.component.html',
  styleUrls: ['html-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsHtmlRendererComponent {

  @Input() public html: string;

}
