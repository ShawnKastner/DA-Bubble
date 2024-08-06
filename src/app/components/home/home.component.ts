import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private resizeSubscription: Subscription | undefined;
  isChannelOrChatActive: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveState();
      });
    this.resizeSubscription = interval(500).subscribe(() => {
      this.updateActiveState();
    });
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  updateActiveState() {
    const url = this.router.url;
    this.isChannelOrChatActive =
      window.innerWidth < 900 &&
      (url.includes('/chat') || url.includes('/channel'));
  }

  backToSideMenu() {
    return this.router.navigateByUrl('/home');
  }

  isThreadRouteActive(): boolean {
    return this.router.url.includes('/thread');
  }
}
