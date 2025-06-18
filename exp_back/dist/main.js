"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerror_model_1 = require("./models/customerror.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
// ROUTES
const users_route_1 = require("./routes/users.route");
const todolist_route_1 = require("./routes/todolist.route");
// EXPRESS VARS-------------
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// TODO LIST ---------------
let listOfTodos = [];
// ALLOW ANG FRONT-END TO ACCESS
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    credentials: true,
}));
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// ROOT AUTHENTICATION
//////////////////////////////////////////////////////////////////////////////////////////
app.use('/', (req, res, next) => {
    // if (req.method === 'GET' && req.originalUrl === '/user') {
    //     return next();
    // }
    // AUTHORIZATION HEADER--------------------------------------------------
    if (req.headers["authorization"]) {
        // GET HEADER------------------------
        let header = req.headers["authorization"];
        // BEARER TOKEN------------------------
        if (header.includes('Bearer')) {
            // GET TOKEN
            let token = header.split(' ')[1];
            // VALID TOKEN
            try {
                let payload = jsonwebtoken_1.default.verify(token, 'SECRETKEY');
                res.setHeader('valid-user', payload.email);
                next();
            }
            // INVALID TOKEN
            catch (e) {
                return res.status(401).send({ status: 401, message: "Invalid or unsupported authentication method" });
            }
        }
        // BASIC TOKEN------------------------
        else if (header.includes('Basic') && req.url == '/user/login') {
            next();
        }
        // NO TOKEN --- NO AUTHORIZED ACCESS------------------------
        else {
            res.status(401).send({ status: 401, message: "No authorized access" }); // TODO - check error message
        }
    }
    // NO HEADER--------------------------------------------------
    else {
        next();
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// ROUTES
//////////////////////////////////////////////////////////////////////////////////////////
app.use('/user', users_route_1.app);
app.use('/todo', todolist_route_1.app);
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// ERROR HANDLER
//////////////////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
    if (err instanceof customerror_model_1.CustomError) {
        res.status(err.statusCode).send({ status: err.statusCode, message: err.message });
    }
    else
        res.status(500).send(err.message);
});
// // GET REQUESTS----------------------------------------------------------
// // ITEM : GET SPECIFIC TASK
// app.get('/todo/:list_id/item/:itemId', (req,res)=>{
//     let listID:number = +req.params.list_id; // get list id from url
//     let taskID:number = +req.params.itemId; // get item id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         // FIND TASK INDEX IF EXISTS
//         let taskIndex = listOfTodos[listIndex].list_items.findIndex(e => e.id == taskID);
//         console.log(taskIndex); //DEV TOOLS
//         // TASK FOUND
//         if (taskIndex > -1) {
//             res.status(200);
//             res.send(listOfTodos[listIndex].list_items[taskIndex]);
//             console.log(listOfTodos[listIndex].list_items[taskIndex]); //DEV TOOLS
//         }
//         // TASK NOT FOUND
//         else {
//             res.status(404);
//             res.send("Todo list item not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//         }
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // ITEM : GET ALL SUBTASKS OF LIST
// app.get('/todo/:list_id/item', (req,res)=>{
//     let listID:number = +req.params.list_id; // get list id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         res.status(200);
//         console.log(listOfTodos[listIndex].list_items);
//         res.send(listOfTodos[listIndex].list_items);
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // LIST: GET ID
// app.get('/todo/:list_id', (req,res)=>{
//     let listID:number = +req.params.list_id; // get list id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         res.status(200);
//         res.send(listOfTodos[listIndex]);
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // LIST: GET ALL (DONE)
// app.get('/todo/', (req,res)=>{
//     res.send({listOfTodos});
// });
// // TEST ........ TODO:: HANDLE RANDOM REQUESTS /todooo/
// app.get('/', (req,res)=>{
//     res.send("Hello!");
// });
// // POST REQUESTS----------------------------------------------------------
// // ITEM : ADD NEW ITEM
// app.post('/todo/:list_id/item', (req,res)=>{
//     if (!req.body.task) {
//         res.status(400);
//         res.send("Task is required");
//     }
//     let listID:number = +req.params.list_id; // get list id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         res.status(200);
//         listOfTodos[listIndex].list_items.push(new TodoListItem(++subtaskCounter,req.body.task));
//         res.send(listOfTodos[listIndex].list_items[subtaskCounter-1]);
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // LIST : ADD NEW LIST
// app.post('/todo', (req,res)=>{
//     // IF USER PROVIDED LIST TITLE
//     if (req.body.title) {
//         res.status(200);
//         listOfTodos.push(new TodoList(++counter, req.body.title));
//         res.send(listOfTodos[counter-1]);
//         console.log(listOfTodos[counter-1]); // DEV TOOLS
//     }
//     // IF USER DIDN'T PROVIDE LIST TITLE
//     else {
//         res.status(400);
//         res.send("Title is required"); // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // PATCH REQUESTS----------------------------------------------------------
// // ITEM : UPDATE
// app.patch('/todo/:list_id/item/:itemId', (req,res)=>{
//     if (!req.body.task) {
//         res.status(404);
//         res.send("Todo list item name (task) is required");
//     }
//     else if (!req.body.completed) {
//         res.status(404);
//         res.send("Todo list item status (completed) is required");
//     }
//     let listID:number = +req.params.list_id; // get list id from url
//     let taskID:number = +req.params.itemId; // get item id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         // FIND TASK INDEX IF EXISTS
//         let taskIndex = listOfTodos[listIndex].list_items.findIndex(e => e.id == listID);
//         // TASK FOUND
//         if (taskIndex > -1) {
//             res.status(204);
//             let todoItem = listOfTodos[listIndex].list_items[taskIndex];
//             todoItem.task = req.body.task;
//             todoItem.updated_at = new Date();
//             if (req.body.completed == "true") {
//                 todoItem.completed = new Date();
//             }
//             else {
//                 todoItem.completed = new Date(0);
//             }
//             res.send(todoItem);
//         }
//         // TASK NOT FOUND
//         else {
//             res.status(404);
//             res.send("Todo list item not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//         }
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // LIST : UPDATE
// app.patch('/todo/:list_id', (req,res)=>{
//     // ERROR - NO TITLE
//     if (!req.body.title) {
//         res.status(400);
//         res.send("Title is required");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
//     let listID:number = +req.params.list_id; // get list id from url
//     // FIND TODOLIST INDEX IF ID EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // SUCCESS - LIST FOUND
//     if (listIndex > -1) {
//         res.status(204);
//         listOfTodos[listIndex].title = req.body.title;
//         res.send(listOfTodos[listIndex]);
//         console.log(listOfTodos); // DEV TOOLS
//     }
//     // ERROR - LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // DELETE REQUESTS----------------------------------------------------------
// // ITEM : DELETE
// app.delete('/todo/:list_id/item/:itemId', (req,res)=>{
//     let listID:number = +req.params.list_id; // get list id from url
//     let taskID:number = +req.params.itemId; // get item id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         // FIND TASK INDEX IF EXISTS
//         let taskIndex = listOfTodos[listIndex].list_items.findIndex(e => e.id == taskID);
//         // TASK FOUND
//         if (taskIndex > -1) {
//             res.status(204);
//             listOfTodos[listIndex].list_items.splice(taskIndex,1);
//             console.log(listOfTodos); // DEV TOOLS
//             res.send("Todo list item deleted");
//         }
//         // TASK NOT FOUND
//         else {
//             res.status(404);
//             res.send("Todo list item not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//         }
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
// // LIST :: DELETE
// app.delete('/todo/:list_id', (req,res)=>{
//     let listID:number = +req.params.list_id; // get list id from url
//     // FIND TODOLIST INDEX IF EXISTS
//     let listIndex = listOfTodos.findIndex(e => e.id == listID);
//     // LIST FOUND
//     if (listIndex > -1) {
//         res.status(204);
//         listOfTodos.splice(listIndex,1);
//         console.log(listOfTodos); // DEV TOOLS
//         res.send("Todo list deleted");
//     }
//     // LIST NOT FOUND
//     else {
//         res.status(404);
//         res.send("Todo list not found");  // TODO:: REPLACE WITH ERROR MESSAGE
//     }
// });
app.listen(3000, () => {
    console.log("Server running on localhost:3000");
}); // LISTEN FOR REQUESTS
