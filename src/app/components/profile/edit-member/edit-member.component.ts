import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
})
export class EditMemberComponent implements OnInit {
  email!: string;
  fullName!: string;
  memberAvatar!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { memberData: any },
    private dialogRef: MatDialogRef<EditMemberComponent>
  ) {}

  ngOnInit() {
    this.email = this.data.memberData.email;
    this.fullName = this.data.memberData.displayName;
    this.memberAvatar = this.data.memberData.avatar;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
