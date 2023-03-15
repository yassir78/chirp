import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "./menu/menu.component";
import {IonicModule} from "@ionic/angular";
import {LogoComponent} from "./logo/logo.component";
import {AvatarComponent} from "./avatar/avatar.component";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {HeaderComponent} from "./header/header.component";
import {AddChirpComponent} from "./add-chirp/add-chirp.component";


@NgModule({
  declarations: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent,
    AddChirpComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LazyLoadImageModule
  ],
  exports: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent,
    AddChirpComponent
  ]
})
export class SharedModule {
}
