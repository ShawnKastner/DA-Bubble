import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
})
export class LogoutDialogComponent {
  constructor(
    private authService: AuthService,
    private dialogRef: DialogRef<LogoutDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { profileData: any }
  ) {}

  openProfileDialog() {
    this.dialogRef.close();
    this.dialog.open(ProfileDialogComponent, {
      panelClass: 'profile-dialog',
      data: { profileData: this.data.profileData },
    });
  }

  logout() {
    this.dialogRef.close();
    this.authService.SignOut();
  }
}
