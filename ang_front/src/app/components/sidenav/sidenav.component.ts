import { Component, OnInit } from '@angular/core';
import { TodoList } from '../../models/todo-list';
import { TodoListService } from '../../services/todo-list.service';
import { UserService } from '../../services/user.service';
import { UserToken } from '../../models/user-token';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})



export class SidenavComponent implements OnInit {

    // STATE========================================================
    listOfPublicTodos:TodoList[] = [];
    listOfPersonalTodos:TodoList[] = [];
    listOfSharedTodos:TodoList[] = [];

    // CONSTRUCTOR==================================================
    constructor(private userService:UserService, private todoService:TodoListService, private router:Router) {

    }

    // BEHAVIOR=====================================================
    viewTodo(todo:TodoList) {
        this.todoService.setCurrentTodo(todo);
        this.todoService.getExtensiveList(todo.id);
        this.router.navigate(["/"]);
    }


    ngOnInit(): void {
        this.todoService.listUpdated.subscribe((em:boolean) => {
            this.listOfPublicTodos = this.todoService.getPublicTodos();
            this.listOfPersonalTodos = this.todoService.getPersonalTodos();
            this.listOfSharedTodos = this.todoService.getSharedTodos();
        })

        this.todoService.updateTodoLists();
    }
}
