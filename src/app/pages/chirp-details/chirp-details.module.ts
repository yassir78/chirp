import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChirpDetailsComponent} from "./chirp-details.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChirpDetailsComponent
      }
    ])]
})
export class ChirpDetailsModule {
}
