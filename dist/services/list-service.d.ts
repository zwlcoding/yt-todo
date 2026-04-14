import type { Todo } from "./todo-service";
export interface List {
    id: string;
    name: string;
    shareToken: string;
    createdAt: Date;
}
export interface ListWithTodos extends List {
    todos: Todo[];
}
export declare function createList(name?: string): Promise<List>;
export declare function getListByToken(token: string): Promise<ListWithTodos | null>;
export declare function addTodoToList(token: string, rawTitle: string): Promise<{
    todo: Todo;
    list: List;
}>;
