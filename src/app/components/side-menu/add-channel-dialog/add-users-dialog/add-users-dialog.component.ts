import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrls: ['./add-users-dialog.component.scss'],
})
export class AddUsersDialogComponent {
  addAllUser!: string;
  certainPeople!: string;

  constructor(private dialogRef: MatDialogRef<AddUsersDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
