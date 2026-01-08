interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (request.method === "GET") {
        try {
            const { results } = await env.DB.prepare("SELECT * FROM feedback ORDER BY createdAt DESC").all();
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
            const { userId, userName, userEmail, rating, suggestion } = data;

            await env.DB.prepare(`
        INSERT INTO feedback (id, userId, userName, userEmail, rating, suggestion)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
                crypto.randomUUID(),
                userId, userName, userEmail, rating, suggestion
            ).run();

            return new Response(JSON.stringify({ success: true }));
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
};
