import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


// CLASS===================================
export class RegisterComponent {

    // STATE-------------------------------
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    passFormControl = new FormControl('', [Validators.required]);
    nameFormControl = new FormControl('', [Validators.required]);
    errorMessage:string = "";

    // CONSTRUCTOR-------------------------
    constructor(private uServ:UserService, private router:Router) {

    }
    
    // BEHAVIOR----------------------------
    async registerUser() {
        // POSSIBILITY OF .value BEING NULL, SO... extra check + as string
        if (!this.emailFormControl.invalid && !this.nameFormControl.invalid && !this.passFormControl.invalid) {
            let result = await this.uServ.createUser(this.emailFormControl.value as string, this.passFormControl.value as string, this.nameFormControl.value as string);

            if (result) {
                this.errorMessage = "User successfully created!";
                this.router.navigate(['/login']);
            }
            else
                this.errorMessage = "User creation failed!";
        }
        else {
            this.errorMessage = "Please fill out all the fields.";
        }
    }

}
