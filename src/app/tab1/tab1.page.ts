import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {AuthFacade} from "../facades/auth.facade";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {TweetsService} from "../services/tweets.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  currentUser$: Observable<User> | undefined;
  tweets$:Observable<any> | undefined;

  constructor(private authFacade:AuthFacade,private router:Router,private tweeetService:TweetsService) {}

  async logout() {
    await this.authFacade.logout();
  }

  ngOnInit(): void {
    this.currentUser$ = this.authFacade.getCurrentUser();
    this.tweets$ = this.tweeetService.getAll();
  }
}
