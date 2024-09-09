import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { UserToken } from '../models/user-token';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfo } from '../models/user-info';
import { Router } from '@angular/router';
import { TodoListService } from './todo-list.service';

@Injectable({
  providedIn: 'root'
})


export class UserService {

    // STATE ---------------------

    baseURL:string = "https://unfwfspring2024.azurewebsites.net/";
    currentUserToken:UserToken|null = null;
    currentUserInfo:UserInfo|null = null;
    usedLoggedIn:EventEmitter<boolean> = new EventEmitter<boolean>();

    
    // BEHAVIOR ------------------

    constructor(private httpClient:HttpClient, private _snackBar: MatSnackBar, private router:Router) { 
    }

    // CREATE
    async createUser(email:string, pass:string, name:string) {
        // create user object
        let userData = {
            "email": email,
            "password": pass,
            "name": name
        }
        // console.log(userData);

        // send in post request to create
        try {
            // 
            let response = await firstValueFrom(this.httpClient.post(`${this.baseURL}user`, userData));
            this._snackBar.open("User successfully created!", 'Close', {verticalPosition:'top', duration:2000});
            return true;
        }
        catch(err:any) {
            this._snackBar.open(`User creation failed! Error ${err.error.status}: ${err.error.message}`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return false;   // create failed
        }

    }


    // UPDATE
    async updateUser(email:string, pass:string, name:string) {

        if (!email && this.currentUserInfo) email = this.currentUserInfo.email;

        // create user object
        let userData = {
            "email": email,
            "password": pass,
            "name": name
        }
        // console.log(userData);

        // send in post request to create
        try {
            // 
            let response = await firstValueFrom(this.httpClient.patch(`${this.baseURL}user`, userData));

            // IF EMAIL OR PASS CHANGED, LOG OUT
            if (this.currentUserInfo && email != this.currentUserInfo.email) {
                this._snackBar.open("User successfully updated! Please log in again.", 'Close', {verticalPosition:'top', duration:2000});
                this.usedLoggedIn.emit(false);
                this.router.navigate(["/login"]);
            }
            else {
                this.getUserInfo();
                // this.usedLoggedIn.emit(true);
                this._snackBar.open("User successfully updated!", 'Close', {verticalPosition:'top', duration:2000});
            }
            return true;
        }
        catch(err:any) {
            this._snackBar.open(`User update failed! Error ${err.error.status}: ${err.error.message}`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return false;   // create failed
        }



    }


    // LOGIN
    async loginUser(email:string, pass:string) {

        // BASE-64 ENC
        let authEncoded = btoa(`${email}:${pass}`);
        let httpheaders = new HttpHeaders();
        httpheaders = httpheaders.set('Authorization', `Basic ${authEncoded}`);

        // LOG IN
        try {
            let userToken = await firstValueFrom(this.httpClient.post<UserToken>(`${this.baseURL}user/login`, null, {headers:httpheaders})); // second arg = body // third = header
            this.currentUserToken = userToken;
            // this.usedLoggedIn.emit(true);
            return userToken;
        }
        catch(err:any) {
            this._snackBar.open(`Login failed (incorrect username or password)! Please try again.`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return firstValueFrom(of(null)); //ensures asynch
        }
    }


    // GET USER'S INFORMATION
    async getUserInfo() {
        try {
            let userInfo = await firstValueFrom(this.httpClient.get<UserInfo>(`${this.baseURL}/user`)); // interceptor auto sends token
            this.currentUserInfo = userInfo;
            this.usedLoggedIn.emit(true);
            return userInfo;
        }
        catch (err:any) { // should not happen
            this._snackBar.open("There was an error getting user info!")
            return firstValueFrom(of(null));
        }
    }


}
