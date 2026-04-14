import { withClient } from "../db";
import { parseNaturalDate } from "../lib/date-parser";
import { generateToken } from "../lib/tokens";

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

function mapTodoRow(row: any): Todo {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    completed: row.completed,
    dueDate: row.due_date,
    shareToken: row.share_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTodos(): Promise<Todo[]> {
  return withClient(async (client) => {
    const result = await client.query(
      `SELECT id, list_id, title, completed, due_date, share_token, created_at, updated_at
       FROM todos
       WHERE completed = false AND list_id IS NULL
       ORDER BY created_at DESC`
    );
    return result.rows.map(mapTodoRow);
  });
}

export async function createTodo(rawTitle: string, listToken?: string): Promise<Todo> {
  const { title, dueDate } = parseNaturalDate(rawTitle.trim());

  let listId: string | null = null;
  if (listToken) {
    const listResult = await withClient(async (client) => {
      return client.query("SELECT id FROM lists WHERE share_token = $1", [listToken]);
    });
    if (listResult.rows.length > 0) {
      listId = listResult.rows[0].id;
    }
  }

  return withClient(async (client) => {
    const result = await client.query(
      `INSERT INTO todos (title, due_date, list_id)
       VALUES ($1, $2, $3)
       RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`,
      [title, dueDate, listId]
    );
    return mapTodoRow(result.rows[0]);
  });
}

export async function completeTodo(id: string): Promise<Todo | null> {
  const shareToken = generateToken(16);
  return withClient(async (client) => {
    const result = await client.query(
      `UPDATE todos SET completed = true, share_token = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`,
      [id, shareToken]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return mapTodoRow(result.rows[0]);
  });
}

export async function deleteTodo(id: string): Promise<void> {
  return withClient(async (client) => {
    await client.query("DELETE FROM todos WHERE id = $1", [id]);
  });
}

export async function seedTodos(): Promise<Todo[]> {
  const samples = [
    { title: "了解 YT-Todo", dueDate: null },
    { title: "完成第一个任务", dueDate: null },
    { title: "删除示例任务", dueDate: null },
  ];

  return withClient(async (client) => {
    const created: Todo[] = [];
    for (const item of samples) {
      const result = await client.query(
        `INSERT INTO todos (title, due_date) VALUES ($1, $2)
         RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`,
        [item.title, item.dueDate]
      );
      created.push(mapTodoRow(result.rows[0]));
    }
    return created;
  });
}

export async function findTodoByShareToken(token: string): Promise<Todo | null> {
  return withClient(async (client) => {
    const result = await client.query(
      `SELECT id, list_id, title, completed, due_date, share_token, created_at, updated_at
       FROM todos WHERE share_token = $1`,
      [token]
    );
    return result.rows[0] ? mapTodoRow(result.rows[0]) : null;
  });
}
