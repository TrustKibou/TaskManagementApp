"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    email;
    name;
    password;
    constructor(id, email, name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
}
exports.User = User;
const listOfUsers = [];
exports.default = listOfUsers;
