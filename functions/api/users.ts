interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    if (request.method === "GET") {
        try {
            const id = url.searchParams.get("id");
            if (!id) return new Response("Missing id", { status: 400 });

            const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
            return new Response(JSON.stringify(user || null), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    if (request.method === "POST") {
        try {
            const data: any = await request.json();
            const { id, name, email } = data;

            await env.DB.prepare(`
        INSERT INTO users (id, name, email)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          email=excluded.email
      `).bind(id, name, email).run();

            return new Response(JSON.stringify({ success: true }));
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
};
