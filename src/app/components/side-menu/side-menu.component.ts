import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  
  constructor(private dialog: MatDialog){}

  openAddChannelDialog() {
    this.dialog.open(AddChannelDialogComponent, {
      panelClass: 'add-channel-dialog',

    }) 
  }
}
