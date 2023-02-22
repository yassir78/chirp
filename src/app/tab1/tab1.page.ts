import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {AuthFacade} from "../facades/auth.facade";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  currentUser$: Observable<User> | undefined;
  constructor(private authFacade:AuthFacade,private router:Router) {}

  async logout() {
    await this.authFacade.logout();
  }

  ngOnInit(): void {
    this.currentUser$ = this.authFacade.getCurrentUser();
  }
}
