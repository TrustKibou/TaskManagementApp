# TASK MANAGEMENT APPLICATION


## IMPORTANT NOTE

This app is currently undergoing a refactor! The Angular front-end runs at :4200, but the updated Express back-end that previously paired with it was lost (due to me not taking advantage of version control). At the moment, only secure account creation, login, and public list creation works correctly.

Instead of refactoring/updating the older API still in the repo, I've decided to rewrite it from scratch in order to refresh my Express skills, but primarily because I enjoy building and testing APIs.

PLANNED UPDATES:
- Rebuild and secure all endpoints
- Update Angular UI/UX design
- Add task 'projects' features (similar to Todoist)
- Add search functionality
- Potentially transition to SQL or AWS MongoDB (for experience)
- Postman API documentation
- Rewrite README (setup, preview, ...)
- Implement Cypress E2E tests
- Additional improvements TBD!

Thank you for your patience while I rebuild and improve the platform!

FUTURE UPDATES:
- 

## About

This is a full-stack task management application with an Angular front-end that utilizes an Express/Node API for account and task management. Includes user authentication (JWT, bcrypt, BA), dynamic and protected routing (guards), and more. Functionalities include shared and public tasks lists/items, reactive forms, and more.

## Steps to Run Development Server

Ensure Node packages are installed.

Run `ng serve` for a dev server and navigate to `http://localhost:4200/`.

Run `node dist/main.js` to launch Express API.

## Screenshots

### User Logged In with Personal Lists
<img width="1280" alt="WD_Personal-Lists" src="https://github.com/user-attachments/assets/1980dd7f-0e53-4119-aff5-dbb5f4ba577f">

### Lists Shared with User
<img width="1280" alt="WD_Shared-Lists" src="https://github.com/user-attachments/assets/f132984b-5d0f-4c17-a09e-711853d032e6">

### Public Lists Available to Visitors (not logged in)
<img width="1280" alt="WD_Unlogged-Home" src="https://github.com/user-attachments/assets/9b65647a-7a7f-4d5a-ac1b-4420921ee1de">
