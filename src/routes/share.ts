import { FastifyInstance } from "fastify";
import { findTodoByShareToken } from "../services/todo-service";

export default async function shareRoutes(app: FastifyInstance) {
  app.get("/share/:token", async (request, reply) => {
    const { token } = request.params as { token: string };
    const todo = await findTodoByShareToken(token);

    if (!todo) {
      return reply.status(404).send({ error: "Share not found" });
    }

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我完成了任务：${escapeHtml(todo.title)}</title>
  <meta property="og:title" content="我完成了任务：${escapeHtml(todo.title)}" />
  <meta property="og:description" content="使用 YT-Todo，高效完成每一天。" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: white; padding: 48px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; max-width: 480px; }
    .check { width: 64px; height: 64px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: white; font-size: 32px; }
    h1 { font-size: 24px; color: #111827; margin: 0 0 12px; }
    p { color: #6b7280; margin: 0 0 24px; }
    a { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✓</div>
    <h1>我完成了「${escapeHtml(todo.title)}」</h1>
    <p>使用 YT-Todo，高效完成每一天。</p>
    <a href="/">去试试 YT-Todo</a>
  </div>
</body>
</html>`;

    return reply.type("text/html").send(html);
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
