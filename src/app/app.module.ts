import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import * as lottieWeb from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AddProductPage } from './pages/add-product/add-product.page';
import { ViewProductsPage } from './pages/products/products.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Import the functions you need from the SDKs you need


export function playerFactory(): any {
  return lottieWeb;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      AddProductPage,
      ViewProductsPage,
      FormsModule,
      CommonModule
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
