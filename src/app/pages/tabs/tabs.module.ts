import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TabsComponent} from "./tabs.component";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'page2',
        loadChildren: () => import('../page2/page2.module').then(m => m.Page2Module)
      },
      {
        path: 'chirp-details/:id',
        loadChildren: () => import('../chirp-details/chirp-details.module').then(m => m.ChirpDetailsModule)
      }
    ]
  },


];


@NgModule({
  declarations: [
    TabsComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class TabsModule {
}
