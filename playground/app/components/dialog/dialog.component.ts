import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { KitchenSinkComponent } from '../kitchen-sink/kitchen-sink.component';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';


@Component({
    templateUrl: './dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        KitchenSinkComponent,
        MatDialogActions,
        MatButton,
        FsFormModule,
        MatDialogClose,
    ],
})
export class DialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<DialogComponent>,
  ) { }

}
