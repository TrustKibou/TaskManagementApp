"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user.model"));
const todolist_model_1 = __importStar(require("../models/todolist.model"));
const todolistitem_model_1 = require("../models/todolistitem.model");
const customerror_model_1 = require("../models/customerror.model");
const saltRounds = 10;
let app = (0, express_1.Router)();
exports.app = app;
let listCounter = 0;
let taskCounter = 0;
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// DELETE - LIST ITEM ID
//////////////////////////////////////////////////////////////////////////////////////////
app.delete("/:list_id/item/:itemId", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER OF TODO LIST, OR SHARED OWNER
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
        if (requestedList.created_by == user_model_1.default[userIndex].id || userIsShared) {
            // VALIDATE SUBTASK
            let taskIndex = requestedList.list_items.findIndex(e => e.id == +req.params.itemId);
            // NOT FOUND
            if (taskIndex == -1) {
                return next(new customerror_model_1.CustomError(404, "Todo list item not found.")); // purely for postman variables being set
            }
            // DELETE LIST ITEM
            requestedList.list_items.splice(taskIndex, 1);
            return res.status(204).send({ status: "200", message: "List item successfully deleted." });
        }
        // NOT AUTHORIZED
        else {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// PATCH --- LIST ITEM ID
//////////////////////////////////////////////////////////////////////////////////////////
app.patch("/:list_id/item/:itemId", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER OF TODO LIST, OR SHARED OWNER
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
        if (requestedList.created_by == user_model_1.default[userIndex].id || userIsShared) {
            // VALIDATE SUBTASK
            let taskIndex = requestedList.list_items.findIndex(e => e.id == +req.params.itemId);
            // NOT FOUND
            if (taskIndex == -1) {
                return next(new customerror_model_1.CustomError(404, "Todo list item not found.")); // purely for postman variables being set
            }
            // FIELD VALIDATION
            let task = requestedList.list_items[taskIndex];
            // TASK
            if (req.body.task != undefined)
                task.task = req.body.task;
            // COMPLETED
            if (req.body.completed && typeof req.body.completed !== 'boolean') {
                return next(new customerror_model_1.CustomError(400, "Completed is in an invalid format."));
            }
            if (req.body.completed && typeof req.body.completed === 'boolean') {
                task.completed = req.body.completed;
                if (task.completed == true) {
                    task.completed_date = new Date();
                    task.completed_by_user = { name: user_model_1.default[userIndex].name, email: user_model_1.default[userIndex].email };
                }
            }
            // DATE
            if (req.body.due_date && !isNaN(new Date(req.body.due_date).getTime())) {
                task.due_date = req.body.due_date;
            }
            else {
                return next(new customerror_model_1.CustomError(400, "Due date is in an invalid format."));
            }
            // CHANGE UPDATED
            task.updated_at = new Date();
            return res.status(204).send({ status: 204, message: "Todo list item updated successfully" });
        }
        // NOT AUTHORIZED
        else {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// GET --- SINGLE LIST ITEM ID
//////////////////////////////////////////////////////////////////////////////////////////
app.get("/:list_id/item/:itemId", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // CHECK IF PUBLIC
    if (requestedList.public_list === true) {
        // FIND SUBTASK
        let taskIndex = requestedList.list_items.findIndex(e => e.id == +req.params.itemId);
        // NOT FOUND
        if (taskIndex == -1) {
            return next(new customerror_model_1.CustomError(404, "Todo list item not found.")); // purely for postman variables being set
        }
        return res.status(200).send(requestedList.list_items[taskIndex]);
    }
    // LOGGED IN - PRIVATE OR SHARED
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER OF TODO LIST, OR SHARED OWNER
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
        if (requestedList.created_by == user_model_1.default[userIndex].id || userIsShared) {
            // FIND SUBTASK
            let taskIndex = requestedList.list_items.findIndex(e => e.id == +req.params.itemId);
            // NOT FOUND
            if (taskIndex == -1) {
                return next(new customerror_model_1.CustomError(404, "Todo list item not found.")); // purely for postman variables being set
            }
            // SEND TASK ITEM
            return res.status(200).send(requestedList.list_items[taskIndex]);
        }
        // NOT AUTHORIZED
        else {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
    }
    else {
        return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// GET --- TODO LIST ITEM LIST
//////////////////////////////////////////////////////////////////////////////////////////
app.get("/:list_id/items", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // CHECK IF PUBLIC
    if (requestedList.public_list === true) {
        return res.status(200).send(requestedList.list_items);
    }
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER OF TODO LIST, OR SHARED OWNER
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
        if (requestedList.created_by == user_model_1.default[userIndex].id || userIsShared) {
            return res.status(200).send(requestedList.list_items);
        }
        // NOT AUTHORIZED
        else {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// POST --- LIST ITEM ID
//////////////////////////////////////////////////////////////////////////////////////////
app.post("/:list_id/item", (req, res, next) => {
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
        let listID = +req.params.list_id; // get list id from url
        let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
        let requestedList;
        if (listIndex == -1)
            return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
        else
            requestedList = todolist_model_1.default[listIndex];
        // ENSURE FIELDS PRESENT
        if (req.body.task == undefined)
            return next(new customerror_model_1.CustomError(400, "Task is required"));
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER OF TODO LIST, OR SHARED OWNER
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
        // SUCCESS
        if (requestedList.created_by == user_model_1.default[userIndex].id || userIsShared) {
            // ADD TASK
            let task = new todolistitem_model_1.TodoListItem(++taskCounter, requestedList.id, req.body.task);
            // CHECK DATE
            if (req.body.due_date && !isNaN(new Date(req.body.due_date).getTime())) {
                task.due_date = req.body.due_date;
            }
            else {
                return next(new customerror_model_1.CustomError(400, "Due date is in an invalid format."));
            }
            // CHECK COMPLETED
            if (req.body.completed && typeof req.body.completed !== 'boolean') {
                return next(new customerror_model_1.CustomError(400, "Completed is in an invalid format."));
            }
            if (req.body.completed && typeof req.body.completed === 'boolean') {
                task.completed = req.body.completed;
                if (task.completed == true) {
                    task.completed_date = new Date();
                    task.completed_by_user = { name: user_model_1.default[userIndex].name, email: user_model_1.default[userIndex].email };
                }
            }
            // CHANGE UPDATED
            task.updated_at = new Date();
            // ADD TASK TO LIST
            requestedList.list_items.push(task);
            return res.status(201).send(task);
        }
        // NOT AUTHORIZED
        else {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// DELETE - SHARED USER
//////////////////////////////////////////////////////////////////////////////////////////
app.delete("/:list_id/share/:shared_user_email?", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER
        if (requestedList.created_by != user_model_1.default[userIndex].id) {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
        // CHECK IF SINGLE DELETE OR ALL DELETE
        // SINGLE
        if (req.params['shared_user_email']) {
            // ENSURE USER EXISTS
            let shareeIndex = requestedList.shared_with.findIndex(e => e.email == req.params.shared_user_email);
            if (shareeIndex == -1)
                return next(new customerror_model_1.CustomError(404, "Specified user does not exist as a shared user on this list.")); // purely for postman variables being set
            // USER EXISTS - DELETE
            let newShared = requestedList.shared_with.filter(item => item.email !== req.params.shared_user_email);
            requestedList.shared_with = newShared;
        }
        // ALL
        else {
            requestedList.shared_with = [];
        }
        return res.status(204).send({ status: 200, message: "Shared user successfully removed." });
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// DELETE --- LIST
//////////////////////////////////////////////////////////////////////////////////////////
app.delete("/:list_id", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER
        if (requestedList.created_by != user_model_1.default[userIndex].id) {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
        // DELETE LIST
        todolist_model_1.default.splice(listIndex, 1);
        res.status(204).send({ status: 204, message: "List successfully deleted." });
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// POST --- SHARED, LIST ID
//////////////////////////////////////////////////////////////////////////////////////////
app.post("/:list_id/share", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // CHECK IF PRIVATE OR SHARED
    if (loggedinUser) {
        // FIND USER
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER
        if (requestedList.created_by != user_model_1.default[userIndex].id) {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
        // ENSURE EMAIL PROVIDED
        if (req.body.email == undefined || req.body.email.length == 0)
            return next(new customerror_model_1.CustomError(400, "Email required."));
        // ENSURE USER EXISTS
        let shareeIndex = user_model_1.default.findIndex(e => e.email == req.body.email);
        if (shareeIndex == -1)
            return next(new customerror_model_1.CustomError(404, "User does not exist."));
        // ENSURE USER ISN'T ALREADY IN LIST
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[shareeIndex].email);
        if (userIsShared)
            return next(new customerror_model_1.CustomError(400, "User is already shared on this list."));
        // SUCCESS - SHARE THE LISt
        requestedList.shared_with.push({ email: user_model_1.default[shareeIndex].email, name: user_model_1.default[shareeIndex].name });
        return res.status(201).send(requestedList);
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// PATCH --- LIST ID
//////////////////////////////////////////////////////////////////////////////////////////
app.patch("/:list_id", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // ENSURE OWNER OF TODO LIST, OR SHARED OWNER
        let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
        if (requestedList.created_by == user_model_1.default[userIndex].id || userIsShared) {
            // ENSURE FIELDS PRESENT
            if ((req.body.title == undefined && req.body.public_list == undefined) || (req.body.public_list != undefined && typeof req.body.public_list !== 'boolean'))
                return next(new customerror_model_1.CustomError(400, "Title or boolean public flag required"));
            if (req.body.title != undefined)
                requestedList.title = req.body.title;
            if (req.body.public_list != undefined)
                requestedList.public_list = req.body.public_list;
            return res.status(204).send({ status: 200, message: "Todo list updated successfully" });
        }
        // NOT AUTHORIZED
        else {
            return next(new customerror_model_1.CustomError(403, "You are not authorized to access this list."));
        }
    }
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to access this list."));
    }
});
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// GET --- LIST ID
//////////////////////////////////////////////////////////////////////////////////////////
app.get("/:list_id", (req, res, next) => {
    // CHECK IF LIST EXISTS - IF NOT, ERROR ... IF IT DOES, GRAB LIST
    let listID = +req.params.list_id; // get list id from url
    let listIndex = todolist_model_1.default.findIndex(e => e.id == listID);
    let requestedList;
    if (listIndex == -1)
        return next(new customerror_model_1.CustomError(404, "Todo list does not exist"));
    else
        requestedList = todolist_model_1.default[listIndex];
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // CHECK IF PUBLIC
    if (requestedList.public_list === true) {
        return res.status(200).send(requestedList);
    }
    // CHECK IF PRIVATE OR SHARED
    if (loggedinUser) {
        // FIND USER
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // IS PRIVATE
        if (requestedList.created_by == user_model_1.default[userIndex].id)
            return res.status(200).send(requestedList);
        // IS SHARED
        else {
            let userIsShared = requestedList.shared_with.some(shared => shared.email === user_model_1.default[userIndex].email);
            if (userIsShared)
                return res.status(200).send({ id: requestedList.id, title: requestedList.title, created_at: requestedList.created_at, public_list: requestedList.public_list, created_by: requestedList.created_by, list_items: requestedList.list_items });
            else
                return next(new customerror_model_1.CustomError(401, "You are not authorized to view this todo list."));
        }
    }
    // NOT LOGGED IN - CHECK IF PUBLIC
    else {
        return next(new customerror_model_1.CustomError(401, "You are not authorized to view this todo list."));
    }
});
////////////////////////////////////////////////////////////////////////////////////////// x
///////////////////////////////////////////////////////// GET --- ROOT (FETCH ALL LISTS)
//////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res, next) => {
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN - DISPLAY PRIVATE LISTS
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1) // not needed; safe
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method"));
        // GET USER ID AND EMAIL
        let userid = user_model_1.default[userIndex].id;
        let useremail = user_model_1.default[userIndex].email;
        // CREATE LIST OF USER'S LISTS
        let totalList = [];
        for (let list of todolist_model_1.default) {
            if (list.created_by == userid || list.public_list === true)
                totalList.push(list);
            else if (list.shared_with != undefined) {
                for (let shared of list.shared_with) {
                    if (shared.email == useremail) {
                        let TempList = new todolist_model_1.TodoList(list.id, list.title, list.public_list);
                        TempList.created_at = list.created_at;
                        TempList.created_by = list.created_by;
                        TempList.list_items = list.list_items;
                        TempList.shared_with = [];
                        totalList.push(TempList);
                    }
                }
            }
        }
        return res.status(200).send(totalList);
    }
    // NOT LOGGED IN - DISPLAY PUBLIC LISTS
    else {
        // DISPLAY PUBLIC LISTS
        let publicLists = todolist_model_1.default.filter(todoList => todoList.public_list == true);
        res.status(200).send(publicLists);
    }
});
////////////////////////////////////////////////////////////////////////////////////////// X
///////////////////////////////////////////////////////// POST --- ROOT (CREATE LIST)
//////////////////////////////////////////////////////////////////////////////////////////
app.post("/", (req, res, next) => {
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1) // NOT SURE THIS IS NEEDED
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method"));
        // CHECK IF TITLE PROVIDED
        if (req.body.title == undefined)
            return next(new customerror_model_1.CustomError(400, "Title and boolean value for public list is required"));
        // CHECK THAT BOOLEAN PROVIDED
        if (req.body.public_list == undefined || typeof req.body.public_list !== 'boolean')
            return next(new customerror_model_1.CustomError(400, "Title and boolean value for public list is required"));
        // CREATE LIST - ADD TO FULL LIST
        let list = new todolist_model_1.TodoList(++listCounter, req.body.title, req.body.public_list);
        list.created_by = user_model_1.default[userIndex].id;
        todolist_model_1.default.push(list);
        res.status(201).send({ id: list.id,
            title: list.title,
            created_at: list.created_at,
            public_list: list.public_list,
            created_by: list.created_by,
            list_items: list.list_items,
        });
    }
    // NOT LOGGED IN
    else {
        return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method"));
    }
});
