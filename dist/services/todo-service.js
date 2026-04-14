"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTodos = listTodos;
exports.createTodo = createTodo;
exports.completeTodo = completeTodo;
exports.deleteTodo = deleteTodo;
exports.seedTodos = seedTodos;
exports.findTodoByShareToken = findTodoByShareToken;
const db_1 = require("../db");
const date_parser_1 = require("../lib/date-parser");
const tokens_1 = require("../lib/tokens");
function mapTodoRow(row) {
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
async function listTodos() {
    return (0, db_1.withClient)(async (client) => {
        const result = await client.query(`SELECT id, list_id, title, completed, due_date, share_token, created_at, updated_at
       FROM todos
       WHERE completed = false AND list_id IS NULL
       ORDER BY created_at DESC`);
        return result.rows.map(mapTodoRow);
    });
}
async function createTodo(rawTitle, listToken) {
    const { title, dueDate } = (0, date_parser_1.parseNaturalDate)(rawTitle.trim());
    let listId = null;
    if (listToken) {
        const listResult = await (0, db_1.withClient)(async (client) => {
            return client.query("SELECT id FROM lists WHERE share_token = $1", [listToken]);
        });
        if (listResult.rows.length > 0) {
            listId = listResult.rows[0].id;
        }
    }
    return (0, db_1.withClient)(async (client) => {
        const result = await client.query(`INSERT INTO todos (title, due_date, list_id)
       VALUES ($1, $2, $3)
       RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`, [title, dueDate, listId]);
        return mapTodoRow(result.rows[0]);
    });
}
async function completeTodo(id) {
    const shareToken = (0, tokens_1.generateToken)(16);
    return (0, db_1.withClient)(async (client) => {
        const result = await client.query(`UPDATE todos SET completed = true, share_token = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`, [id, shareToken]);
        if (result.rowCount === 0) {
            return null;
        }
        return mapTodoRow(result.rows[0]);
    });
}
async function deleteTodo(id) {
    return (0, db_1.withClient)(async (client) => {
        await client.query("DELETE FROM todos WHERE id = $1", [id]);
    });
}
async function seedTodos() {
    const samples = [
        { title: "了解 YT-Todo", dueDate: null },
        { title: "完成第一个任务", dueDate: null },
        { title: "删除示例任务", dueDate: null },
    ];
    return (0, db_1.withClient)(async (client) => {
        const created = [];
        for (const item of samples) {
            const result = await client.query(`INSERT INTO todos (title, due_date) VALUES ($1, $2)
         RETURNING id, list_id, title, completed, due_date, share_token, created_at, updated_at`, [item.title, item.dueDate]);
            created.push(mapTodoRow(result.rows[0]));
        }
        return created;
    });
}
async function findTodoByShareToken(token) {
    return (0, db_1.withClient)(async (client) => {
        const result = await client.query(`SELECT id, list_id, title, completed, due_date, share_token, created_at, updated_at
       FROM todos WHERE share_token = $1`, [token]);
        return result.rows[0] ? mapTodoRow(result.rows[0]) : null;
    });
}
