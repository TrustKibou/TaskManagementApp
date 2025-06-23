export class User {
    id:number;
    email:string;
    name:string;
    password:string;

    constructor(id:number, email:string, name:string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
}

const listOfUsers:User[] = [];


export default listOfUsers;