import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/light_novels/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Light novel ID is required" }, 400);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM light_novels WHERE id = ?"
  )
    .bind(id)
    .all();

  if (!results) {
    return c.json({ error: `Light novel with ID:${id} is not found` }, 404);
  }

  return c.json({
    id: results[0].id,
    title: results[0].title,
    isRealTitle: results[0].is_real_title,
  });
});

export default app;
