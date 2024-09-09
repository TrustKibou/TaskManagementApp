import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TodoListService } from '../../services/todo-list.service';
import { TodoList } from '../../models/todo-list';
import { UserInfo } from '../../models/user-info';
import { Router } from '@angular/router';
import { ExtensiveTodoList } from '../../models/extensive-todo-and-items';
import { FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit {

    currentTodo:TodoList|null = null;
    currentUser:UserInfo|null = null;
    currentTodoExtensive:ExtensiveTodoList|null = null;
    subItemFormControl = new FormControl('');
    disabledSetting:boolean = true;
    sharedWith:boolean = false;

    // STATE========================================================

    
    // CONSTRUCTOR==================================================
    constructor(private userService:UserService, private todoService:TodoListService, private router:Router, private _snackBar: MatSnackBar) {

    }

    // BEHAVIOR=====================================================
    ngOnInit(): void {

        // FOR WHEN SWITCHING FROM ANOTHER ROUTE
        this.currentTodo = this.todoService.currentTodo;
        this.currentUser = this.userService.currentUserInfo;
        this.currentTodoExtensive = this.todoService.currentExtensiveTodo;

        // FOR WHEN MOVING ON SAME ROUTE
        this.todoService.todoSelected.subscribe((em:boolean) => {
            this.currentTodo = this.todoService.currentTodo;
            this.currentTodoExtensive = this.todoService.currentExtensiveTodo;

            // try this in subscription...
            this.todoService.sharedWithUsers = []; // clear
        
            if (this.currentTodoExtensive) {
                for (let user of this.currentTodoExtensive.shared_with) {
                    this.todoService.sharedWithUsers.push(user);

                    if (user.email == this.currentUser?.email)
                        this.sharedWith = true;
                }
            }
    
        });

        this.userService.usedLoggedIn.subscribe((em:boolean)=> {
            if (em)
                this.currentUser = this.userService.currentUserInfo;
            else {
                this.currentUser = null;
            }
        })

        // console.log(this.currentTodoExtensive?.list_items);
    }


    // DELETE TODO LIST
    async deleteTodo() {
        if (this.currentTodo) {
            let result = await this.todoService.deleteList(this.currentTodo.id);   // make call to api
            this.currentTodo = null;
        }
    }

    // SHARE TODO LIST
    share() {
        this.todoService.sharedWithUsers = []; // clear
        
        if (this.currentTodoExtensive) {
            for (let user of this.currentTodoExtensive.shared_with) {
                this.todoService.sharedWithUsers.push(user); // clear... TODO: turn into a subscription to avoid all this redundant code across components
            }
        }

        // console.log(this.todoService.sharedWithUsers);

        if (this.currentTodo)
            this.router.navigate(['/share', this.currentTodo.id]);
    }

    // COMPLETE SUB TASK
    completeSubTask(subId:number) {

        let shared:boolean = false;

        if (this.currentTodoExtensive) {
            for (let user of this.currentTodoExtensive.shared_with) {
                if (user.email == this.currentUser?.email)
                    shared = true;
            }
        }

        if (!this.subItemFormControl.invalid && this.currentTodo) {
            if (this.currentUser?.id != this.currentTodo.created_by && !shared) {
                this._snackBar.open(`You are not the owner of this todo list! You cannot complete sub-items; your change will not affect the server. (this is due to the inability to use the disabled property with Angular Material checkbox)`)

                // // RESET CHECKBOX
                // if (this.subItemFormControl.value == "true") {
                //     this.subItemFormControl.setValue("false");
                //     console.log("set false")
                // }
                // else {
                //     this.subItemFormControl.setValue("true");
                //     console.log("set true")
                // }
            }
            else {
                this.todoService.completeItem(this.currentTodo.id, subId, this.subItemFormControl.value as string);
            }
        }
    }

    // ADD SUB-ITEM
    addSubItem() {
        if (this.currentTodo)
            this.router.navigate(['/addsubitem', this.currentTodo.id]);
    }
    
    // DELETE SUB-ITEM
    async deleteSubItem(subId:number) {
        if (!this.subItemFormControl.invalid && this.currentTodo) {
            let success = await this.todoService.deleteSubItem(this.currentTodo.id, subId);
        }
    }
}
