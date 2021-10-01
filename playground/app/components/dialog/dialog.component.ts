import {
  Component,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: './dialog.component.html'
})
export class DialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<DialogComponent>,
  ) { }

}
