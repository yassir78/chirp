import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ChirpComponent } from './components/chirp/chirp.component';
import {SharedModule} from "../../shared/shared.module";
import { ChirpDetailsComponent } from '../chirp-details/chirp-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        SharedModule
    ],
  declarations: [HomePage,ChirpComponent, ChirpDetailsComponent]
})
export class HomePageModule {}
