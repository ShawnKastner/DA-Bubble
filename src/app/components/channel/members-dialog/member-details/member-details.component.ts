import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  memberDetails: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { memberData: any },
    private dialogRef: MatDialogRef<MemberDetailsComponent>
  ) {}

  ngOnInit() {
    this.memberDetails = this.data.memberData;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
