import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { EditMemberComponent } from '../../profile/logout-dialog/profile-dialog/edit-member/edit-member.component';

@Component({
  selector: 'app-members-dialog',
  templateUrl: './members-dialog.component.html',
  styleUrls: ['./members-dialog.component.scss'],
})
export class MembersDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MembersDialogComponent>,
    public channelService: ChannelService,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.channelService.getAllChannelMembers(this.data.channelID);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * The `openAddMemberDialog()` method is responsible for opening a dialog box to add a new member to a channel. It closes
   * the current dialog box and opens the `AddMemberDialogComponent` dialog box. It passes the `channelID` and `channelName`
   * as data to the `AddMemberDialogComponent`.
   *
   * @method
   * @name openAddMemberDialog
   * @kind method
   * @memberof MembersDialogComponent
   * @returns {void}
   */
  openAddMemberDialog() {
    this.closeDialog();
    this.dialog.open(AddMemberDialogComponent, {
      data: {
        channelID: this.data.channelID,
        channelName: this.data.channelName,
      },
      panelClass: 'add-member-dialog',
    });
  }

  /**
   * The `openMemberDetails(member: any)` method is responsible for opening a dialog box to display the details of a member.
   * It takes a `member` object as a parameter, which contains the details of the member.
   * 
   * @method
   * @name openMemberDetails
   * @kind method
   * @memberof MembersDialogComponent
   * @param {any} member
   * @returns {void}
   */
  openMemberDetails(member: any) {
    this.closeDialog();
    if (member.displayName === this.authService.userData.displayName) {
      this.dialog.open(EditMemberComponent, {
        data: { profileData: member },
        panelClass: 'edit-member-dialog',
      });
    } else {
      this.dialog.open(MemberDetailsComponent, {
        data: { memberData: member },
        panelClass: 'member-details-dialog',
      });
    }
  }
}
