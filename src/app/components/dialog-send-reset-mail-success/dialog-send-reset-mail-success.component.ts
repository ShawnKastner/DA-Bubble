import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-send-reset-mail-success',
  templateUrl: './dialog-send-reset-mail-success.component.html',
  styleUrls: ['./dialog-send-reset-mail-success.component.scss'],
})
export class DialogSendResetMailSuccessComponent {
  constructor(
    public dialog: MatDialogRef<DialogSendResetMailSuccessComponent>
  ) {}
}
