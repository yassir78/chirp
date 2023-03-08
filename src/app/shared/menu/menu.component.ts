import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacade } from 'src/app/facades/auth.facade';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  auth = inject(AuthFacade);
  connectedUser : Observable<User> | undefined;

  constructor() { }

  ngOnInit() {
    this.connectedUser = this.auth.getCurrentUser();
    console.log('user',this.connectedUser);
  }

  getUserFullName(user: User | null) {
    if (!user) {
      return '';
    }
    return `${user.firstname} ${user.lastname}`;
  }

  getUserTag(user: User | null) {
    if (!user) {
      return '';
    }
    return `@${user.username}`;
  }

  async logoutUser() {
    await this.auth.logout();
  }
}
