export class CustomError extends Error{
    statusCode:number;

    constructor(statusCode:number, message:string) {
        super(message); //Invoke the parent class Error constructor with its parameters
        this.statusCode = statusCode;
    }
}