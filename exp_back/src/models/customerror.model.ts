export class CustomError extends Error{
    statusCode:number;

    constructor(statusCode:number, message:string) {
        super(message);     // call Error with message
        this.statusCode = statusCode;
    }
}