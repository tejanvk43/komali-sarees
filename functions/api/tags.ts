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

    if (request.method === "POST") {
        try {
            const data: any = await request.json();
            const id = data.id || crypto.randomUUID();
            const { name, category, colorHex } = data;

            await env.DB.prepare("INSERT INTO tags (id, name, category, colorHex) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category, colorHex=excluded.colorHex")
                .bind(id, name, category, colorHex || null).run();
            return new Response(JSON.stringify({ success: true, id }));
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
