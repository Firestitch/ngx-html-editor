import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { environment } from 'playground/environments/environment';


import { DialogComponent } from '../dialog';


@Component({
  templateUrl: 'examples.component.html'
})
export class ExamplesComponent implements OnInit {
  public config = environment;

  constructor(
    private _dialog: MatDialog,
  ) { }

  public ngOnInit(): void {

  }

  public openDialog(): void {
    this._dialog.open(DialogComponent);
  }
}
