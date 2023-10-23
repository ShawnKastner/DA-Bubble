import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewMessageService } from 'src/app/shared/services/new-message.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  memberDetails: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { memberData: any },
    private dialogRef: MatDialogRef<MemberDetailsComponent>,
    private newMessageService: NewMessageService,
    private route: Router
  ) {}

  ngOnInit() {
    this.memberDetails = this.data.memberData;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  newMessageToUser(user: any) {
    this.closeDialog();
    this.newMessageService.selectName(user);
    this.newMessageService.nameInput = '@' + this.memberDetails.displayName;
    this.route.navigate(['home/newMessage']);
  }
}
