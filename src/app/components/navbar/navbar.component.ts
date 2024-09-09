import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from '../../models/user-info';
import { UserService } from '../../services/user.service';
import { TodoListService } from '../../services/todo-list.service';
import { UserToken } from '../../models/user-token';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent implements OnInit {
    
    // STATE--------------------------------------
    @Output() toggle = new EventEmitter<void>();
    currentUser:UserInfo|null = null;


    // CONSTRUCTOR--------------------------------
    constructor(private router:Router, private uServ:UserService, private todoService:TodoListService) {
    }

    // BEHAVIOR-----------------------------------
    // side menu
    toggleMenu():void {
        this.toggle.emit();
    }

    // logout
    logout():void {
        this.currentUser = null;
        this.uServ.currentUserInfo = null;
        this.uServ.currentUserToken = null;
        this.todoService.updateTodoLists();
        this.router.navigate(['/login']);
        // console.log("Logout2");
    }

    // update current user after login
    ngOnInit():void {

        // USED TO GET USER'S INFO ONCE THEY LOG IN
        this.uServ.usedLoggedIn.subscribe((loggedInStatus:boolean)=> {
            if (loggedInStatus) {
                this.currentUser = this.uServ.currentUserInfo;
            }
            else {
                this.logout();
            }
        });
    }
}
