import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditMemberComponent } from './edit-member/edit-member.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileDetails: any;

  constructor(private dialog: MatDialog) {}

  openEditMemberDialog() {
    this.dialog.open(EditMemberComponent, {
      data: { profileData: this.profileDetails },
      panelClass: 'edit-member-dialog',
    });
  }
}
