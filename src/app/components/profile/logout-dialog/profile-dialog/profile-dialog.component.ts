import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit{
  profileDetails: any;

  constructor(
    private dialogRef: DialogRef<ProfileDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { profileData: any }
  ) {}

  ngOnInit() {
    this.profileDetails = this.data.profileData;
  }

  openEditMemberDialog() {
    this.closeDialog();
    this.dialog.open(EditMemberComponent, {
      data: { profileData: this.profileDetails },
      panelClass: 'edit-member-dialog',
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
