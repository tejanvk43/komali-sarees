interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    console.log("==========================================");
    console.log("ADMIN API v2.0 - REQUEST RECEIVED");
    console.log(`Method: ${request.method} | URL: ${request.url}`);

    try {
        if (request.method === "GET") {
            const uid = url.searchParams.get("id");
            console.log(`[ADMIN_CHECK] UID from URL: "${uid}"`);

            if (!uid) {
                console.error("[ADMIN_CHECK] No UID provided in search params.");
                return new Response("Missing id", { status: 400 });
            }

            if (!env.DB) {
                console.error("[ADMIN_CHECK] DATABASE BINDING 'DB' IS MISSING!");
                // Emergency mock check
                const isMockAdmin = uid === "YShEywcksESsm9GnhILOOO3kj5h2" || uid === "j9wP7R0VAZYzoXRVpebzsTq3G9n2";
                console.log(`[ADMIN_CHECK] Returning EMERGENCY MOCK for "${uid}": ${isMockAdmin}`);
                return new Response(JSON.stringify({ isAdmin: isMockAdmin }), {
                    headers: { "Content-Type": "application/json" }
                });
            }

            let admin = await env.DB.prepare("SELECT * FROM admins WHERE uid = ?").bind(uid).first();

            // AUTO-SYNC: If this is the known admin UID but not in DB, add it!
            if (!admin && (uid === "YShEywcksESsm9GnhILOOO3kj5h2" || uid === "j9wP7R0VAZYzoXRVpebzsTq3G9n2")) {
                console.log(`[ADMIN_CHECK] Auto-syncing admin UID: ${uid}`);
                await env.DB.prepare("INSERT INTO admins (uid, email) VALUES (?, ?)")
                    .bind(uid, "admin@komalisarees.com").run();
                admin = { uid, email: "admin@komalisarees.com" };
            }

            const result = !!admin;

            console.log(`[ADMIN_CHECK] DB Scan for "${uid}": Found=${result}`);
            if (admin) {
                console.log(`[ADMIN_CHECK] Match details:`, admin);
            }

            return new Response(JSON.stringify({ isAdmin: result }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("!!! CRITICAL ERROR IN ADMIN API !!!");
        console.error(e.message);
        console.error(e.stack);
        return new Response(JSON.stringify({
            error: e.message,
            stack: e.stack
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
