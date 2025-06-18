"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoListItem = void 0;
class TodoListItem {
    id;
    task;
    completed;
    created_at;
    updated_at;
    constructor(id, task) {
        this.id = id;
        this.task = task;
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}
exports.TodoListItem = TodoListItem;
