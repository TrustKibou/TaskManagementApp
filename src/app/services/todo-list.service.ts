import { EventEmitter, Injectable } from '@angular/core';
import { TodoList } from '../models/todo-list';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { UserToken } from '../models/user-token';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, of } from 'rxjs';
import { UserInfo } from '../models/user-info';
import { ExtensiveTodoList, LimitedUser } from '../models/extensive-todo-and-items';

@Injectable({
  providedIn: 'root'
})



export class TodoListService {

    // STATE======================================================================================
    baseURL:string = "https://unfwfspring2024.azurewebsites.net/";
    listOfPublicTodos:TodoList[] = [];
    listOfPersonalTodos:TodoList[] = [];
    listOfSharedTodos:TodoList[] = [];
    listUpdated:EventEmitter<boolean> = new EventEmitter<boolean>();
    todoSelected:EventEmitter<boolean> = new EventEmitter<boolean>();
    currentTodo:TodoList|null = null;
    currentExtensiveTodo:ExtensiveTodoList|null = null;
    sharedWithUsers:LimitedUser[]=[];

    // CONSTRUCTOR=====================================================================
    constructor(private httpClient:HttpClient, private uServ:UserService, private _snackBar: MatSnackBar) { }


    // BEHAVIOR===================================================================================
    // UPDATE LIST OF TODOS--------------------------------------
    updateTodoLists():void {

        // CLEAR EXISTING LISTS
        this.listOfPersonalTodos = [];
        this.listOfPublicTodos = [];
        this.listOfSharedTodos = [];

        // console.log("HEY!");
        // console.log(this.uServ.currentUserToken?.token);
        // console.log(this.uServ.currentUserInfo?.id);

        // UPDATE LISTS
        this.httpClient.get<TodoList>(`${this.baseURL}todo`).subscribe((data:any)=>{
            for (let row of data) {
                if (this.uServ.currentUserInfo) {
                    if (row.created_by == this.uServ.currentUserInfo.id) {
                        this.listOfPersonalTodos.push(row);
                    }
                    else if (row.public_list) {
                        this.listOfPublicTodos.push(row);
                    }
                    else {
                        this.listOfSharedTodos.push(row);
                    }
                }
                else {
                    if (row.public_list) {
                        this.listOfPublicTodos.push(row);
                    }
                }
            }
        });

        this.listUpdated.emit(true);
    }

    getPublicTodos() {
        return this.listOfPublicTodos;
    }
    getPersonalTodos() {
        return this.listOfPersonalTodos;
    }
    getSharedTodos() {
        return this.listOfSharedTodos;
    }

    setCurrentTodo(todo:TodoList) {
        this.currentTodo = todo;
        this.getExtensiveList(todo.id);
        this.todoSelected.emit(true);
        // return true;
    }

    async createTodoList(title:string, public_list:string) {

        let bool_public = false;
        if (public_list != "") bool_public = true;

        let todoList = {
            "title": title,
            "public_list": bool_public
        }

        try {
            let response = await firstValueFrom(this.httpClient.post(`${this.baseURL}todo`, todoList));
            this._snackBar.open("Todo list successfully created!", 'Close', {verticalPosition:'top', duration:2000});
            return true;
        }
        catch(err:any) {
            this._snackBar.open(`Todo list creation failed! Error ${err.error.status}: ${err.error.message}`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return false;   // create failed
        }


        return true;
    }

    // DELETE LIST-------------------------
    async deleteList(todoID:number) {
        try {
            let response = await firstValueFrom(this.httpClient.delete(`${this.baseURL}todo/${todoID}`));
            // console.log(response);
            this._snackBar.open("Todo list successfully deleted!, 'Close', {verticalPosition:'top', duration:2000}");
            this.updateTodoLists();
            return true; // success
        }
        catch(err:any) {
            this._snackBar.open(`Todo list deletion failed! Error ${err.error.status}: ${err.error.message}`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return false;   // fail
        }
    }

    // SHARE LIST----------------------------
    async shareList(email:string, todoID:number) {

        let user = {
            "email": email
        }

        try {
            let response = await firstValueFrom(this.httpClient.post(`${this.baseURL}todo/${todoID}/share`, user));
            // console.log(response);
            this._snackBar.open("Todo list successfully shared!, 'Close', {verticalPosition:'top', duration:2000}");
            return true; // success
        }
        catch(err:any) {
            this._snackBar.open(`Todo list share failed! Error ${err.error.status}: ${err.error.message}`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return false;   // fail
        }
    }

    // GET SPECIFIC LIST INFO---------------------------- todo: merge with lighter todo list (forgot API was different until it was too late ;-;) (its so late ;-;)
    async getExtensiveList(todoID:number) {
        try {
            let response = await firstValueFrom(this.httpClient.get<ExtensiveTodoList>(`${this.baseURL}todo/${todoID}`));

            // console.log(response);
            this.currentExtensiveTodo = response;
            this.todoSelected.emit(true);
            return response;
        }
        catch(err:any) { // should not happen
            this._snackBar.open(`Todo list access failed (incorrect todo ID)! Error ${err.error.status}: ${err.error.message}`, 'Close', {verticalPosition:'top', duration:2000}); // will show error # with message returned from API
            return null;
        }
    }

    // COMPLETE TODO LIST ITEM
    async completeItem(listId:number, subId:number, status:string) {

        let bool = false;

        if (status) bool=true;

        let completed = {
            "completed": bool
        }
        // console.log("List ID: " + listId + ", Sub ID: " + subId);

        try {
            let succ = await firstValueFrom(this.httpClient.patch(`${this.baseURL}todo/${listId}/item/${subId}`, completed)); // interceptor auto sends token

        }
        catch(err:any) {
            this._snackBar.open(`There was an error completing the subtask! Error ${err}: ${err.message}, 'Close', {verticalPosition:'top', duration:2000}`)
        }
    }


    // ADD SUB LIST ITEM
    async addSubItem(taskTitle:string, listId:number) {

        let task = {
            "task": taskTitle
        }

        try {
            let succ = await firstValueFrom(this.httpClient.post(`${this.baseURL}todo/${listId}/item/`, task));
            let newlist = this.getExtensiveList(listId);
            return newlist;
        }
        catch(err:any) {
            this._snackBar.open(`There was an error adding the subtask! Error ${err}: ${err.message}`, 'Close', {verticalPosition:'top', duration:2000})
            return firstValueFrom(of(null));
        }
    }


    // DELETE SUB LIST ITEM
    async deleteSubItem(listId:number, subId:number) {
        try {
            let succ = await firstValueFrom(this.httpClient.delete(`${this.baseURL}todo/${listId}/item/${subId}`));
            let newlist = this.getExtensiveList(listId);
            return newlist;
        }
        catch(err:any) {
            this._snackBar.open(`There was an error deleting the subtask! Error ${err}: ${err.message}`, 'Close', {verticalPosition:'top', duration:2000})
            return firstValueFrom(of(null));
        }

    }


    // DELETE SHARED USER
    async deleteSharedUser(listId:number, email:string) {
        try {
            let succ = await firstValueFrom(this.httpClient.delete(`${this.baseURL}todo/${listId}/share/${email}`));
            let newlist = this.getExtensiveList(listId);
            return newlist;
        }
        catch(err:any) {
            this._snackBar.open(`There was an error deleting the shared user! Error ${err}: ${err.message}`, 'Close', {verticalPosition:'top', duration:2000})
            return firstValueFrom(of(null));
        }

    }
}
