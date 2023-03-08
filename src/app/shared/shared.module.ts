import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "./menu/menu.component";
import {IonicModule} from "@ionic/angular";
import {LogoComponent} from "./logo/logo.component";
import {AvatarComponent} from "./avatar/avatar.component";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {HeaderComponent} from "./header/header.component";


@NgModule({
  declarations: [
    MenuComponent,
    LogoComponent,
    AvatarComponent,
    HeaderComponent
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
    HeaderComponent
  ]
})
export class SharedModule {
}
