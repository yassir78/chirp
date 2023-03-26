import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ProfileDetailsComponent} from "./profile-details.component";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import { ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    ProfileDetailsComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileDetailsComponent
      }
    ]),
    IonicModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ProfileDetailsModule {
}
