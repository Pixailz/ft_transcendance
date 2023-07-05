import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LandingcomponentComponent } from './landingcomponent/landingcomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingcomponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
