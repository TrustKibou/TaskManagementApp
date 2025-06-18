import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';   // For reactive forms (FormControl)
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './views/app/app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import {MatTabsModule} from '@angular/material/tabs';
import {AsyncPipe} from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bearerTokenInterceptorInterceptor } from './interceptor/bearer-token-interceptor.interceptor';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AccountComponent } from './views/account/account.component'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'; 
import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from './views/home/home.component'; 
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddlistComponent } from './views/addlist/addlist.component';
import { ShareComponent } from './views/share/share.component';
import { AdditemComponent } from './views/additem/additem.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip'; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    SidenavComponent,
    AccountComponent,
    HomeComponent,
    AddlistComponent,
    ShareComponent,
    AdditemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    AsyncPipe,
    FormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([bearerTokenInterceptorInterceptor])),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
