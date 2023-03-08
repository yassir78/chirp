import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {AuthFacade} from "../../facades/auth.facade";
import {Observable} from "rxjs";
import {User} from "../../models/user";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() avatar: string | undefined;
  auth = inject(AuthFacade);
  connectedUser : Observable<User> | undefined;
  constructor() { }

  ngOnInit() {
    this.connectedUser = this.auth.getCurrentUser();
  }

  async logoutUser() {
    await this.auth.logout();
  }

}
