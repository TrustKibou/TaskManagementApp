import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';
import { AddlistComponent } from './views/addlist/addlist.component';
import { AccountComponent } from './views/account/account.component';
import { noauthGuard } from './guards/noauth.guard';
import { ShareComponent } from './views/share/share.component';
import { AdditemComponent } from './views/additem/additem.component';

const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'register',
        component: RegisterComponent
    },
    {
        path:'addlist',
        canActivate:[noauthGuard],
        component: AddlistComponent
    },
    {
        path:'account',
        canActivate:[noauthGuard],
        component: AccountComponent
    },
    {
        path:'share/:todoID',
        canActivate:[noauthGuard],
        component: ShareComponent
    },
    {
        path:'addsubitem/:todoID',
        canActivate:[noauthGuard],
        component: AdditemComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
