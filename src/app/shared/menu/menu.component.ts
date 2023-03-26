import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacade } from 'src/app/facades/auth.facade';
import { User } from 'src/app/models/user';
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  auth = inject(AuthFacade);
  connectedUser : Observable<User> | undefined;
  activePage = "app/home";

  router = inject(Router);

  constructor() { }

  ngOnInit() {
    this.connectedUser = this.auth.getCurrentUser();
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

  async changePage(newPage: string) {
    this.activePage = newPage;
    await this.router.navigate([newPage]);
  }

  async logoutUser() {
    await this.auth.logout();
  }
}
