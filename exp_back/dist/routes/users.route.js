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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
let userCounter = 1;
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// POST --- LOGIN
//////////////////////////////////////////////////////////////////////////////////////////
app.post('/login', (req, res, next) => {
    // GET USER LOGIN INFO FROM HEADER--------------------------------------
    if (req.headers["authorization"]) {
        // DISECT LOGIN INFORMATION----------------
        let userInfo = req.headers['authorization'].split(' ')[1]; // grab username:password
        let decodedUserInfo = atob(userInfo); // decode basic encoding
        let userEmail = decodedUserInfo.split(':')[0].toLowerCase(); // user email
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
////////////////////////////////////////////////////// GET - GRAB USER INFO FOR CHANGE/LOG
//////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // BEARER
        if (!token)
            return next(new customerror_model_1.CustomError(401, 'Auth token missing'));
        const decoded = jsonwebtoken_1.default.verify(token, 'SECRETKEY');
        const foundUser = user_model_1.default.find(user => user.email === decoded.email);
        if (!foundUser)
            return next(new customerror_model_1.CustomError(404, 'User not found!'));
        const userInfo = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name
        };
        res.status(200).send(userInfo);
    }
    catch (err) {
        return next(new customerror_model_1.CustomError(401, 'Invalid token'));
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// POST --- ROOT (CREATE)
//////////////////////////////////////////////////////////////////////////////////////////
app.post('/', (req, res, next) => {
    // CATCH ERRORS--------------------------------------------------
    if (!req.body.email || !req.body.password || !req.body.name) {
        return next(new customerror_model_1.CustomError(400, "Email, password, and name are all required")); // pass off to global error handler defined in main.ts
    }
    // CHECK IF EMAIL IS UNIQUE--------------------------------------------------
    // convert email to lower case - avoid case-sens when logging in
    const email = req.body.email.toLowerCase();
    // check if email is already attached to a user
    let emailIndex = user_model_1.default.findIndex(e => e.email == email);
    // email exists - error
    if (emailIndex != -1) {
        return next(new customerror_model_1.CustomError(400, "Email already exists"));
    }
    // CREATE USER AND HASH PASSWORD--------------------------------------------------
    let newUser = new user_model_1.User(++userCounter, email, req.body.name);
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
            // convert email to lower case - avoid case-sens when logging in
            const email = req.body.email.toLowerCase();
            // check if email is already attached to a user
            let emailIndex = user_model_1.default.findIndex(e => e.email == email);
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
            user_model_1.default[userIndex].email = req.body.email.toLowerCase();
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
