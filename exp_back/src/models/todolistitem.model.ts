export class TodoListItem {
    id:number;
    task:string;
    completed:boolean;
    completed_date:Date|null;
    created_at:Date;
    updated_at:Date;
    due_date:Date;
    list_id:number;
    completed_by_user:{email:string, name:string}|null;

    constructor(id:number, list_id:number, task:string) {
        this.id = id;
        this.list_id = list_id;
        this.task = task;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.completed = false;
        this.completed_date = null;
        this.completed_by_user = null;
    }
}