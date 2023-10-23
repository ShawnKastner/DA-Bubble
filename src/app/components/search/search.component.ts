import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { EditMemberComponent } from '../profile/logout-dialog/profile-dialog/edit-member/edit-member.component';
import { MemberDetailsComponent } from '../channel/members-dialog/member-details/member-details.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  constructor(
    public searchService: SearchService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  search() {
    this.searchService.search();
  }

  clearSearchInput() {
    this.searchService.searchText = '';
  }

  openUserDetails(member: any) {
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
