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
import {ReactiveFormsModule} from "@angular/forms";
import {ChirpListSkeletonComponent} from "./chirp-list-skeleton/chirp-list-skeleton.component";


@NgModule({
  declarations: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent,
    AddChirpComponent,
    ChirpUserComponent,
    ChirpListSkeletonComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImageModule,
    ScrollingModule,
    ReactiveFormsModule

  ],
  exports: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent,
    AddChirpComponent,
    ChirpListSkeletonComponent
  ]
})
export class SharedModule {
}
