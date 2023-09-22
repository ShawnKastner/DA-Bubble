import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-send-reset-mail',
  templateUrl: './send-reset-mail.component.html',
  styleUrls: ['./send-reset-mail.component.scss'],
})
export class SendResetMailComponent {
  emailValue!: string;

  constructor(public authService: AuthService) {}
}
