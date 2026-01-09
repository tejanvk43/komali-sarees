export async function onRequest(context: { request: Request, env: any }) {
    const { request, env } = context;
    const url = new URL(request.url);

    const mockUser = {
        id: "mock-user-123",
        name: "Mock User",
        email: "user@example.com",
        createdAt: new Date().toISOString()
    };

    try {
        if (request.method === "GET") {
            if (!env.DB) return Response.json(mockUser);

            const id = url.searchParams.get("id");
            if (!id) return new Response("Missing id", { status: 400 });

            const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
            return Response.json(user || null);
        }

        if (request.method === "POST") {
            if (!env.DB) return Response.json({ success: true });

            const data: any = await request.json();
            const { id, name, email } = data;

            await env.DB.prepare(`
                INSERT INTO users (id, name, email)
                VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name=excluded.name,
                  email=excluded.email
            `).bind(id, name, email).run();

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
