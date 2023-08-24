import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUsersDialogComponent } from './add-users-dialog/add-users-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss'],
})
export class AddChannelDialogComponent {

  constructor(private dialog: MatDialog, private dialogRef: DialogRef<AddChannelDialogComponent>) {}

  openAddUserToChannelDialog() {
    this.dialogRef.close();
    this.dialog.open(AddUsersDialogComponent, {
      panelClass: 'add-user-dialog',
    }) 
  
  }
}
