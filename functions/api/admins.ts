interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    if (request.method === "GET") {
        try {
            const uid = url.searchParams.get("id");
            if (!uid) return new Response("Missing id", { status: 400 });

            const admin = await env.DB.prepare("SELECT * FROM admins WHERE uid = ?").bind(uid).first();
            return new Response(JSON.stringify({ isAdmin: !!admin }), {
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

    return new Response("Method not allowed", { status: 405 });
};
