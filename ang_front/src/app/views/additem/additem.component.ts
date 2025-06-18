import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrl: './additem.component.css'
})



export class AdditemComponent {
    nameFormControl = new FormControl('', [Validators.required]);
    currentTodoId:number = 0;
    errorMessage:string = '';

    constructor(private todoService:TodoListService, private route:ActivatedRoute, private router:Router) {
        this.route.params.subscribe(params => {
            this.currentTodoId=params['todoID'];
            // console.log(params['todoID']);
        });
    }


    async addSubTask() {
        if (!this.nameFormControl.invalid) {
            let result = await this.todoService.addSubItem(this.nameFormControl.value as string, this.currentTodoId as number);

            if (result) {
                this.errorMessage = "Todo list item successfully added";
                this.router.navigate(['/']);
            }
            else
                this.errorMessage = "Todo list item add failed!";
        }
        else {
            this.errorMessage = "Please fill out all the fields.";
        }

    }
}
