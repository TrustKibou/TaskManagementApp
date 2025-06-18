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
exports.listOfUsers = exports.app = void 0;
const express_1 = require("express");
const user_model_1 = __importStar(require("../models/user.model"));
exports.listOfUsers = user_model_1.default;
const customerror_model_1 = require("../models/customerror.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 10;
let app = (0, express_1.Router)();
exports.app = app;
let userCounter = 0;
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// POST --- LOGIN
//////////////////////////////////////////////////////////////////////////////////////////
app.post('/login', (req, res, next) => {
    // GET USER LOGIN INFO FROM HEADER--------------------------------------
    if (req.headers["authorization"]) {
        // DISECT LOGIN INFORMATION----------------
        let userInfo = req.headers['authorization'].split(' ')[1]; // grab username:password
        let decodedUserInfo = atob(userInfo); // decode basic encoding
        let userEmail = decodedUserInfo.split(':')[0]; // user email
        let userPass = decodedUserInfo.split(':')[1]; // user password
        let foundUser;
        // CHECK IF EMAIL EXISTS----------------
        let userIndex = user_model_1.default.findIndex(e => e.email == userEmail); // check if in list of users
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid email or password")); // if not, error
        else
            foundUser = user_model_1.default[userIndex]; // if so, assign user
        // CHECK IF PASSWORD MATCHES----------------
        bcrypt_1.default.compare(userPass, foundUser.password, (err, result) => {
            // USER FOUND --- PROCEED
            if (result) {
                let token = jsonwebtoken_1.default.sign({ email: foundUser?.email }, 'SECRETKEY');
                res.status(200).send({ token: token });
            }
            // USER NOT FOUND --- ERROR
            else
                return next(new customerror_model_1.CustomError(401, "Invalid username or password"));
        });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// POST --- ROOT (CREATE)
//////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    console.log("Worked!");
    return res.status(200).send(user_model_1.default);
});
app.post('/', (req, res, next) => {
    // CATCH ERRORS--------------------------------------------------
    if (!req.body.email || !req.body.password || !req.body.name) {
        return next(new customerror_model_1.CustomError(400, "Email, password, and name are all required"));
    }
    // CHECK IF EMAIL IS UNIQUE--------------------------------------------------
    // check if email is already attached to a user
    let emailIndex = user_model_1.default.findIndex(e => e.email == req.body.email);
    // email exists - error
    if (emailIndex != -1) {
        return next(new customerror_model_1.CustomError(400, "Email already exists"));
    }
    // CREATE USER AND HASH PASSWORD--------------------------------------------------
    let newUser = new user_model_1.User(++userCounter, req.body.email, req.body.name);
    bcrypt_1.default.genSalt(saltRounds, (err, salt) => {
        bcrypt_1.default.hash(req.body.password, salt, (err, hash) => {
            newUser.password = hash;
            user_model_1.default.push(newUser);
            res.status(201).send({ id: newUser.id, email: newUser.email, name: newUser.name });
        });
    });
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// PATCH --- ROOT (UPDATE)
//////////////////////////////////////////////////////////////////////////////////////////
app.patch('/', (req, res, next) => {
    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");
    // LOGGED IN
    if (loggedinUser) {
        // CHECK IF EMAIL EXISTS & IS UNIQUE--------------------------------------------------
        if (req.body.email != undefined) {
            // check if email is already attached to a user
            let emailIndex = user_model_1.default.findIndex(e => e.email == req.body.email);
            // email exists - error
            if (emailIndex != -1) {
                return next(new customerror_model_1.CustomError(400, "Email already exists"));
            }
        }
        // FIND USER--------------------------------------------------
        let userIndex = user_model_1.default.findIndex(e => e.email == loggedinUser?.toString());
        if (userIndex == -1)
            return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set
        // CHECK IF NAME, PW EXISTS & UPDATE --------------------------------------------------
        if (req.body.email != undefined)
            user_model_1.default[userIndex] = req.body.email;
        if (req.body.name != undefined)
            user_model_1.default[userIndex].name = req.body.name;
        if (req.body.password != undefined) {
            bcrypt_1.default.genSalt(saltRounds, (err, salt) => {
                bcrypt_1.default.hash(req.body.password, salt, (err, hash) => {
                    user_model_1.default[userIndex].password = hash;
                });
            });
        }
        res.status(200).send({ id: user_model_1.default[userIndex].id, email: user_model_1.default[userIndex].email, name: user_model_1.default[userIndex].name });
    }
    // NOT LOGGED IN
    else {
        return next(new customerror_model_1.CustomError(401, "Invalid or unsupported authentication method"));
    }
});
