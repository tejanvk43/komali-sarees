interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const path = url.pathname;

    // GET /api/products
    if (request.method === "GET") {
        try {
            const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();

            // Parse JSON strings back to arrays
            const products = results.map(p => {
                try {
                    return {
                        ...p,
                        images: JSON.parse(p.images as string || "[]"),
                        tags: JSON.parse(p.tags as string || "[]")
                    };
                } catch (parseErr) {
                    console.error("JSON Parse Error on product:", p.id, parseErr);
                    return { ...p, images: [], tags: [] };
                }
            });

            return new Response(JSON.stringify(products), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({
                error: e.message,
                stack: e.stack,
                envKeys: Object.keys(env)
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    // POST /api/products (Admin only - validation should be added)
    if (request.method === "POST") {
        try {
            const data: any = await request.json();
            const { id, name, price, description, dressType, fabric, color, occasion, stock, images, tags } = data;

            await env.DB.prepare(`
        INSERT INTO products (id, name, price, description, dressType, fabric, color, occasion, stock, images, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          price=excluded.price,
          description=excluded.description,
          dressType=excluded.dressType,
          fabric=excluded.fabric,
          color=excluded.color,
          occasion=excluded.occasion,
          stock=excluded.stock,
          images=excluded.images,
          tags=excluded.tags
      `).bind(
                id, name, price, description, dressType, fabric, color, occasion, stock,
                JSON.stringify(images), JSON.stringify(tags)
            ).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({
                error: e.message,
                stack: e.stack,
                envKeys: Object.keys(env)
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (request.method === "DELETE") {
        try {
            const id = url.searchParams.get("id");
            if (!id) return new Response("Missing id", { status: 400 });
            await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }));
        } catch (e: any) {
            return new Response(JSON.stringify({
                error: e.message,
                stack: e.stack,
                envKeys: Object.keys(env)
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    return new Response("Method not allowed", { status: 405 });
};
