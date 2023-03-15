import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  router = inject(Router);

  constructor() {
  }

  ngOnInit() {
  }

  async login() {
    await this.router.navigate(['/auth/login']);
  }
}
