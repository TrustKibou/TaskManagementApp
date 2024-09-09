import { UserInfo } from "./user-info"

export interface TodoItem {
    id: number
    task: string
    completed: boolean
    todo_list_id: number
    completed_by: number
    updated_at: string
    completed_by_user: UserInfo
  }