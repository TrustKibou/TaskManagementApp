import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TodoListService } from '../../services/todo-list.service';
import { Router } from '@angular/router';
import { UserToken } from '../../models/user-token';

@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrl: './addlist.component.css'
})



export class AddlistComponent {
    titleFormControl = new FormControl('', [Validators.required]);
    publicFormControl = new FormControl('');
    errorMessage:string = "";


    constructor(private todoService:TodoListService, private router:Router) {

    }


    async createList() {

        if (!this.titleFormControl.invalid && !this.publicFormControl.invalid) {
            let result = await this.todoService.createTodoList(this.titleFormControl.value as string, this.publicFormControl.value as string);

            if (result) {
                this.errorMessage = "Todo list successfully created";
                this.todoService.updateTodoLists();
                this.router.navigate(['/']);
            }
            else
                this.errorMessage = "Todo list creation failed!";
        }
        else {
            this.errorMessage = "Please fill out all the fields.";
        }


    }
}
