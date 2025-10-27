import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { environment } from 'playground/environments/environment';

import { DialogComponent } from '../dialog';
import { FsExampleModule } from '@firestitch/example';
import { KitchenSinkComponent } from '../kitchen-sink/kitchen-sink.component';


@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsExampleModule, KitchenSinkComponent],
})
export class ExamplesComponent {
  private _dialog = inject(MatDialog);

  public config = environment;

  public openDialog(): void {
    this._dialog.open(DialogComponent, {
      width: '600px',
    });
  }
}
