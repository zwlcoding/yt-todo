export interface Todo {
    id: string;
    listId: string | null;
    title: string;
    completed: boolean;
    dueDate: Date | null;
    shareToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare function listTodos(): Promise<Todo[]>;
export declare function createTodo(rawTitle: string, listToken?: string): Promise<Todo>;
export declare function completeTodo(id: string): Promise<Todo | null>;
export declare function deleteTodo(id: string): Promise<void>;
export declare function seedTodos(): Promise<Todo[]>;
export declare function findTodoByShareToken(token: string): Promise<Todo | null>;
