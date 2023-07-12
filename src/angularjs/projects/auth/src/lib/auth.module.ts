import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
  ],
  exports: [
    AuthComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
