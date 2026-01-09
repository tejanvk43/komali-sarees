export async function onRequest(context: { request: Request, env: any }) {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        if (request.method === "GET") {
            const uid = url.searchParams.get("id");
            if (!uid) return new Response("Missing id", { status: 400 });

            // Mock Admin Fallback for the primary account
            if (!env.DB) {
                const isAdmin = uid === "j9wP7R0VAZYzoXRVpebzsTq3G9n2" || uid === "admin-mock-id";
                return Response.json({ isAdmin });
            }

            const admin = await env.DB.prepare("SELECT * FROM admins WHERE uid = ?").bind(uid).first();
            return Response.json({ isAdmin: !!admin });
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
