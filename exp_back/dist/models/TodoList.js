"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoList = void 0;
class TodoList {
    id;
    title;
    created_at;
    list_items;
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.created_at = new Date();
        this.list_items = [];
    }
}
exports.TodoList = TodoList;
