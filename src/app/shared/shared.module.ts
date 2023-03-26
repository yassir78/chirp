import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "./menu/menu.component";
import {IonicModule} from "@ionic/angular";
import {LogoComponent} from "./logo/logo.component";
import {AvatarComponent} from "./avatar/avatar.component";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {HeaderComponent} from "./header/header.component";
import {AddChirpComponent} from "./add-chirp/add-chirp.component";
import {ChirpUserComponent} from "./chirp-user/chirp-user.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChirpListSkeletonComponent} from "./chirp-list-skeleton/chirp-list-skeleton.component";
import {ChirpSkeletonComponent} from "./chirp-skeleton/chirp-skeleton.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";


@NgModule({
  declarations: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent,
    AddChirpComponent,
    ChirpUserComponent,
    ChirpListSkeletonComponent,
    ChirpSkeletonComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImageModule,
    ScrollingModule,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    FormsModule

  ],
  exports: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent,
    AddChirpComponent,
    ChirpListSkeletonComponent,
    ChirpSkeletonComponent,
    ChirpUserComponent,
    ForgotPasswordComponent
  ]
})
export class SharedModule {
}
