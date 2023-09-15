import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileDetails: any;
  userData: any;
  userID!: string;

  constructor(
    private dialog: MatDialog,
    private firestore: AngularFirestore
  ) {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
      this.userID = this.userData.uid;
    }
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.firestore
      .collection('users')
      .doc(this.userID)
      .valueChanges()
      .subscribe((data: any) => {
        this.profileDetails = data;
      });
  }

  openEditMemberDialog() {
    this.dialog.open(EditMemberComponent, {
      data: { profileData: this.profileDetails },
      panelClass: 'edit-member-dialog',
    });
  }
}
