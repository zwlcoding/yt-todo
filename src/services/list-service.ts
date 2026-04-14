import { withClient } from "../db";
import { generateToken } from "../lib/tokens";
import { parseNaturalDate } from "../lib/date-parser";
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

function mapListRow(row: any): List {
  return {
    id: row.id,
    name: row.name,
    shareToken: row.share_token,
    createdAt: row.created_at,
  };
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

export async function createList(name?: string): Promise<List> {
  const listName = name?.trim() || "共享清单";
  const shareToken = generateToken(16);

  return withClient(async (client) => {
    const result = await client.query(
      `INSERT INTO lists (name, share_token) VALUES ($1, $2)
       RETURNING id, name, share_token, created_at`,
      [listName, shareToken]
    );
    return mapListRow(result.rows[0]);
  });
}

export async function getListByToken(token: string): Promise<ListWithTodos | null> {
  return withClient(async (client) => {
    const listResult = await client.query(
      `SELECT id, name, share_token, created_at FROM lists WHERE share_token = $1`,
      [token]
    );
    if (listResult.rows.length === 0) {
      return null;
    }

    const todosResult = await client.query(
      `SELECT id, list_id, title, completed, due_date, share_token, created_at, updated_at
       FROM todos
       WHERE list_id = $1 AND completed = false
       ORDER BY created_at DESC`,
      [listResult.rows[0].id]
    );

    return {
      ...mapListRow(listResult.rows[0]),
      todos: todosResult.rows.map(mapTodoRow),
    };
  });
}

export async function addTodoToList(token: string, rawTitle: string): Promise<{ todo: Todo; list: List }> {
  const { title, dueDate } = parseNaturalDate(rawTitle.trim());

  return withClient(async (client) => {
    const listResult = await client.query(
      "SELECT id, name, share_token, created_at FROM lists WHERE share_token = $1",
      [token]
    );
    if (listResult.rows.length === 0) {
      throw new Error("List not found");
    }

    const todoResult = await client.query(
      `INSERT INTO todos (title, due_date, list_id)
       VALUES ($1, $2, $3)
       RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`,
      [title, dueDate, listResult.rows[0].id]
    );

    return {
      todo: mapTodoRow(todoResult.rows[0]),
      list: mapListRow(listResult.rows[0]),
    };
  });
}
