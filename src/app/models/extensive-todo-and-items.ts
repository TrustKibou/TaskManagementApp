export interface ExtensiveTodoList {
    id: number
    title: string
    created_at: string
    public_list: boolean
    created_by: number
    list_items: ListItem[]
    shared_with: LimitedUser[]
  }
  
  export interface ListItem {
    id: number
    task: string
    completed: boolean
    todo_list_id: number
    completed_by: number
    updated_at: string
    completed_by_user: LimitedUser
  }
  
  export interface LimitedUser {
    email: string
    name: string
  }
  