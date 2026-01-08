interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (request.method === "GET") {
        try {
            const { results } = await env.DB.prepare("SELECT * FROM tags ORDER BY name ASC").all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    if (request.method === "POST") {
        try {
            const data: any = await request.json();
            const { id, name, category } = data;
            await env.DB.prepare("INSERT INTO tags (id, name, category) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category")
                .bind(id, name, category).run();
            return new Response(JSON.stringify({ success: true }));
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
};
