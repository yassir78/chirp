import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Page2Component} from "./page2.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [Page2Component],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class Page2Module {
}
