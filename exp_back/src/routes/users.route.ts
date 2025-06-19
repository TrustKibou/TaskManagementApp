import { Router } from "express";
import listOfUsers, { User } from "../models/user.model";
import { CustomError } from "../models/customerror.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds =10;
let app = Router();
let userCounter:number = 0;


//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// POST --- LOGIN
//////////////////////////////////////////////////////////////////////////////////////////
app.post('/login', (req, res, next)=>{
    
    // GET USER LOGIN INFO FROM HEADER--------------------------------------
    if (req.headers["authorization"]) {

        // DISECT LOGIN INFORMATION----------------
        let userInfo = req.headers['authorization'].split(' ')[1];  // grab username:password
        let decodedUserInfo = atob(userInfo);                       // decode basic encoding

        let userEmail = decodedUserInfo.split(':')[0];               // user email
        let userPass = decodedUserInfo.split(':')[1];                // user password

        let foundUser:User;

        // CHECK IF EMAIL EXISTS----------------
        let userIndex = listOfUsers.findIndex(e => e.email == userEmail);                       // check if in list of users

        if (userIndex == -1)  return next(new CustomError(401, "Invalid email or password"));   // if not, error
        else foundUser = listOfUsers[userIndex];                                                // if so, assign user


        // CHECK IF PASSWORD MATCHES----------------
        bcrypt.compare(userPass, foundUser.password, (err,result) => {

            // USER FOUND --- PROCEED
            if(result) {
                let token = jwt.sign({email: foundUser?.email}, 'SECRETKEY');
                res.status(200).send({token: token});
            }

            // USER NOT FOUND --- ERROR
            else
                return next(new CustomError(401, "Invalid username or password"));
          })

    }

});



//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// GET - VIEW USER LIST (TEST - TEMP METHOD)
//////////////////////////////////////////////////////////////////////////////////////////


app.get('/', (req, res) => {
    console.log("Worked!");
    return res.status(200).send(listOfUsers);
});




//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// POST --- ROOT (CREATE)
//////////////////////////////////////////////////////////////////////////////////////////

app.post('/', (req, res, next)=>{

    // CATCH ERRORS--------------------------------------------------
    if (!req.body.email || !req.body.password || !req.body.name) {
        return next(new CustomError(400, "Email, password, and name are all required"));    // pass off to global error handler defined in main.ts
    }


    // CHECK IF EMAIL IS UNIQUE--------------------------------------------------
    
    // check if email is already attached to a user
    let emailIndex = listOfUsers.findIndex(e => e.email == req.body.email);

    // email exists - error
    if (emailIndex != -1) {
        return next(new CustomError(400, "Email already exists"))
    }


    // CREATE USER AND HASH PASSWORD--------------------------------------------------

    let newUser = new User(++userCounter, req.body.email, req.body.name);

    bcrypt.genSalt(saltRounds, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err,hash)=>{
            newUser.password = hash;
            listOfUsers.push(newUser);
            res.status(201).send({id: newUser.id, email: newUser.email, name: newUser.name});
        });
    });
});




//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// PATCH --- ROOT (UPDATE)
//////////////////////////////////////////////////////////////////////////////////////////
app.patch('/', (req, res, next)=>{

    // CHECK IF LOGGED IN
    let loggedinUser = res.getHeader("valid-user");

    // LOGGED IN
    if (loggedinUser) {
 
        // CHECK IF EMAIL EXISTS & IS UNIQUE--------------------------------------------------
        if (req.body.email != undefined) {

            // check if email is already attached to a user
            let emailIndex = listOfUsers.findIndex(e => e.email == req.body.email);

            // email exists - error
            if (emailIndex != -1) {
                return next(new CustomError(400, "Email already exists"))
            }
        }

        // FIND USER--------------------------------------------------
        let userIndex = listOfUsers.findIndex(e => e.email == loggedinUser?.toString());

        if (userIndex == -1) 
            return next(new CustomError(401, "Invalid or unsupported authentication method")); // purely for postman variables being set



        // CHECK IF NAME, PW EXISTS & UPDATE --------------------------------------------------

        if (req.body.email != undefined)
            listOfUsers[userIndex].email = req.body.email;
        
        if (req.body.name != undefined)  
            listOfUsers[userIndex].name = req.body.name;

        if (req.body.password != undefined) { 
            bcrypt.genSalt(saltRounds, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err,hash)=>{
                    listOfUsers[userIndex].password = hash;
                });
            });
        }

        res.status(200).send({id: listOfUsers[userIndex].id, email: listOfUsers[userIndex].email, name: listOfUsers[userIndex].name});

        
    }

    // NOT LOGGED IN
    else {
        return next(new CustomError(401, "Invalid or unsupported authentication method"));
    }






});



// EXPORT
export {app, listOfUsers};