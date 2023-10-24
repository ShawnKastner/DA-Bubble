import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DialogChangeSuccessPasswordComponent } from '../dialog-change-success-password/dialog-change-success-password.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  oobCode: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.route.queryParams.subscribe((params) => {

      if (params['oobCode']) {
        this.oobCode = params['oobCode'];
      }
    });
  }

  changePassword() {
    if (this.newPassword === this.confirmPassword) {
      this.authService
        .changePassword(this.oobCode, this.newPassword)
        .then(() => {
          this.successChanged('500ms', '500ms');
          this.router.navigate(['/']);
        })
        .catch((error) => {
          console.log('Fehler beim ändern des Passworts', error);
        });
    }
  }

  successChanged(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogChangeSuccessPasswordComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
