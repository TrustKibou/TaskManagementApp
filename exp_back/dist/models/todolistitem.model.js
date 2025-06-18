"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListItem = void 0;
class TodoListItem {
    id;
    task;
    completed;
    completed_date;
    created_at;
    updated_at;
    due_date;
    list_id;
    completed_by_user;
    constructor(id, list_id, task) {
        this.id = id;
        this.list_id = list_id;
        this.task = task;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.completed = false;
        this.completed_date = null;
        this.completed_by_user = null;
    }
}
exports.TodoListItem = TodoListItem;
