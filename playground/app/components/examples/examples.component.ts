import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { environment } from 'playground/environments/environment';

import { DialogComponent } from '../dialog';


@Component({
  templateUrl: './examples.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesComponent {
  public config = environment;

  constructor(
    private _dialog: MatDialog,
  ) { }

  public openDialog(): void {
    this._dialog.open(DialogComponent, {
      width: '600px',
    });
  }
}
