import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private authService:AuthService,private router:Router) {}

  async logout() {
    await this.authService.logout();
     await this.router.navigateByUrl('/auth/login')
  }
}
