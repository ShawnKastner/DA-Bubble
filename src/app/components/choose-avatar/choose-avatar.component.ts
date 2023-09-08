import { Component } from '@angular/core';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent {
  allAvatars = [
    {
      name: 'avatar0',
      src: 'assets/img/avatars/00c.Charaters.png'
    },
    {
      name: 'avatar1',
      src: 'assets/img/avatars/01c.Charaters.png'
    },
    {
      name: 'avatar2',
      src: 'assets/img/avatars/02c.Charaters.png'
    },
    {
      name: 'avatar3',
      src: 'assets/img/avatars/03c.Charaters.png'
    },
    {
      name: 'avatar4',
      src: 'assets/img/avatars/04c.Charaters.png'
    },
    {
      name: 'avatar5',
      src: 'assets/img/avatars/05c.Charaters.png'
    }]
    
}
