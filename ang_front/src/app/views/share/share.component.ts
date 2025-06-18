import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TodoListService } from '../../services/todo-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LimitedUser } from '../../models/extensive-todo-and-items';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrl: './share.component.css'
})




export class ShareComponent implements OnInit {
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    currentTodoId:number = 0;
    errorMessage:string = "";
    sharedWithUsers:LimitedUser[]=[];


    constructor(private todoService:TodoListService, private route:ActivatedRoute, private router:Router) {
        this.route.params.subscribe(params => {
            this.currentTodoId=params['todoID'];
            // console.log(params['todoID']);
        });
    }


    // UPDATE LIST OF CURRENTLY SHARED USERS-----------------
    async ngOnInit() {
        // let resp = await this.todoService.getSharedUsers(this.currentTodoId);
        this.sharedWithUsers = this.todoService.sharedWithUsers;
    }


    // SEND SHARE REQUEST------------------------------------
    async shareList() {

        if (!this.emailFormControl.invalid) {
            let result = await this.todoService.shareList(this.emailFormControl.value as string, this.currentTodoId as number);

            if (result) {
                this.errorMessage = "Todo list successfully shared";
                this.todoService.getExtensiveList(this.currentTodoId);

                this.router.navigate(['/']);
            }
            else
                this.errorMessage = "Todo list share failed!";
        }
        else {
            this.errorMessage = "Please fill out all the fields.";
        }
    }    


    // DELETE SHARED USER------------------------------------
    async deleteSharedUser(userEmail:string) {
        let newlist = await this.todoService.deleteSharedUser(this.currentTodoId, userEmail);

        if (newlist) {
            this.sharedWithUsers = [];

            for (let user of newlist?.shared_with) {
                this.sharedWithUsers.push(user);
            }
            this.todoService.sharedWithUsers = this.sharedWithUsers;

            // console.log(this.sharedWithUsers);
        }
        else {
            this.errorMessage = "Failed to delete!";
        }
    }
}
