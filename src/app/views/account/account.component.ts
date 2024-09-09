import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserInfo } from '../../models/user-info';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})



// CLASS===================================
export class AccountComponent {

    // STATE-------------------------------
    emailFormControl = new FormControl('', [Validators.email]);
    passFormControl = new FormControl('', []);
    nameFormControl = new FormControl('', []);
    userInfo:UserInfo|null = null;
    errorMessage:string = "";

    // CONSTRUCTOR-------------------------
    constructor(private uServ:UserService, private router:Router) {
        this.userInfo = this.uServ.currentUserInfo;
        
        // if (this.userInfo)
        //     this.emailFormControl.setValue(this.userInfo.email);
    }
    
    // BEHAVIOR----------------------------
    async updateUser() {

        let em = this.emailFormControl.value;
        // if (em) {
        //     // console.log(this.emailFormControl.value);
        //     // console.log(this.nameFormControl.value);
        //     // console.log(this.passFormControl.value);
        // }
        

        if (!this.emailFormControl.invalid && !this.nameFormControl.invalid && !this.passFormControl.invalid) {
            let result = await this.uServ.updateUser(this.emailFormControl.value as string, this.passFormControl.value as string, this.nameFormControl.value as string);

            if (result) {
                this.errorMessage = "User successfully created!";
                // this.router.navigate(['/login']);
            }
            else
                this.errorMessage = "User creation failed!";
        }
        else {
            this.errorMessage = "Please fill out all the fields.";
        }
    }

}

