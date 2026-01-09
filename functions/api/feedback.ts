export async function onRequest(context: { request: Request, env: any }) {
    const { request, env } = context;

    try {
        if (request.method === "GET") {
            if (!env.DB) return Response.json([]);

            const { results } = await env.DB.prepare("SELECT * FROM feedback ORDER BY createdAt DESC").all();
            return Response.json(results);
        }

        if (request.method === "POST") {
            if (!env.DB) return Response.json({ success: true });

            const data: any = await request.json();
            const { userId, userName, userEmail, rating, suggestion } = data;

            await env.DB.prepare(`
                INSERT INTO feedback (id, userId, userName, userEmail, rating, suggestion)
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
                crypto.randomUUID(),
                userId, userName, userEmail, rating, suggestion
            ).run();

            return Response.json({ success: true });
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        return Response.json({
            error: e.message,
            stack: e.stack,
            envKeys: Object.keys(env || {})
        }, { status: 500 });
    }
}
