import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/light_novels/_random", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM light_novels ORDER BY RANDOM() LIMIT 1"
  ).all();

  if (!results || results.length === 0) {
    return c.json({ error: "No light novels found" }, 404);
  }

  return c.json({
    id: results[0].id,
    title: results[0].title,
    isRealTitle: results[0].is_real_title,
  });
});

export default app;
