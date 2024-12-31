import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Page3PageRoutingModule } from './page3-routing.module';

import { Page3Page } from './page3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Page3PageRoutingModule
  ],
  declarations: [Page3Page]
})
export class Page3PageModule {}
