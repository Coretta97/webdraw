import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GuestHeaderComponent } from './guest-header/guest-header.component';
import { CookieService } from 'ngx-cookie-service';
import { UserHeaderComponent } from './user-header/user-header.component';
import { EditorComponent } from './editor/editor.component';
import { GraphComponent } from './graph/graph.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WelcomeComponent,
    LoginComponent,
    RegisterComponent,
    GuestHeaderComponent,
    UserHeaderComponent,
    EditorComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
      HttpClientModule,
      MDBBootstrapModule.forRoot(),
      AppRoutingModule,
      FormsModule,
      MDBBootstrapModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
