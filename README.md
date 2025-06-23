# TASK MANAGEMENT APPLICATION

## About
This is a full-stack task management application with an Angular front-end that utilizes an Express/Node API for account and task management. Includes user authentication (JWT, bcrypt, BA), dynamic and protected routing, and more. Features include private, shared and public task lists/items, reactive forms, and more (implemented and to come).

(The back-end is now updated so that it works perfectly with the Angular front-end; there are a few bugs detailed below that I am fixing. Thank you for your patience as I repair!)


## Steps to Run Development Server
Ensure Node packages are installed.

Run `ng serve` in 'ang_front' for a dev server and navigate to `http://localhost:4200/`.

Run `node dist/main.js` in 'exp_back' to launch Express API.



## Recent Updates
- Repaired all endpoints; app is fully-functioning
- Email logins are no longer case-sensitive
- List state is no longer preserved across logins
- Disabled checkboxes for public lists (for non-owners)




## Current Known Bugs
- shared_with attr error in shared lists (doesn't effect current functionality; just need to fix console log)
- due date doesnt show in tasks (haven't implemented this yet, so this is more of a feature I need to add)



## Planned Updates
- Rebuild and secure all endpoints
- Update Angular UI/UX design
- Add task 'projects' features (similar to Todoist)
- Add search functionality
- Potentially transition to SQL or AWS MongoDB (for experience)
- Postman API documentation
- Rewrite README (setup, preview, ...)
- Implement Cypress E2E tests
- Additional improvements TBD!



## Screenshots

### User Logged In with Personal Lists
<img width="1280" alt="WD_Personal-Lists" src="https://github.com/user-attachments/assets/1980dd7f-0e53-4119-aff5-dbb5f4ba577f">

### Lists Shared with User
<img width="1280" alt="WD_Shared-Lists" src="https://github.com/user-attachments/assets/f132984b-5d0f-4c17-a09e-711853d032e6">

### Public Lists Available to Visitors (not logged in)
<img width="1280" alt="WD_Unlogged-Home" src="https://github.com/user-attachments/assets/9b65647a-7a7f-4d5a-ac1b-4420921ee1de">
