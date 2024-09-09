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

    // asyncTabs: Observable<ExampleTab[]>;
    
    // this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
    //     setTimeout(() => {
    //       observer.next([
    //         {label: 'First', content: 'Content 1'},
    //         {label: 'Second', content: 'Content 2'},
    //         {label: 'Third', content: 'Content 3'},
    //       ]);
    //     }, 1000);
    //   });
}
