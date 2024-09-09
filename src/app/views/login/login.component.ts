import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TodoListService } from '../../services/todo-list.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})



export class LoginComponent {
    username:string = "";
    password:string = "";

    constructor(private router:Router, private uServ:UserService, private todoService:TodoListService) {
    }

    async loginUser() {
        let userToken = await this.uServ.loginUser(this.username, this.password);

        if (userToken) {
            let userInfo = await this.uServ.getUserInfo();
            this.todoService.updateTodoLists();
            this.router.navigate(["/"]); // navigate back to home page for list of todos
        }
        else {
        }
    }

}
