import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-change-success-password',
  templateUrl: './dialog-change-success-password.component.html',
  styleUrls: ['./dialog-change-success-password.component.scss'],
})
export class DialogChangeSuccessPasswordComponent {
  constructor(public dialog: MatDialogRef<DialogChangeSuccessPasswordComponent>) {}
}
