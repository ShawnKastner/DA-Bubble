import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
    @Inject(MAT_DIALOG_DATA) public data: { profileData: any },
    private dialogRef: MatDialogRef<EditMemberComponent>,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.email = this.data.profileData.email;
    this.fullName = this.data.profileData.displayName;
    this.memberAvatar = this.data.profileData.avatar;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  editUser() {
    this.firestore
      .collection('users')
      .doc(this.data.profileData.uid)
      .update({
        displayName: this.fullName,
        email: this.email,
      })
      .then(() => {
        this.dialogRef.close();
      });
  }
}
