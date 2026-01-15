interface Env {
    DB: D1Database;
}

const ensureUsersTable = async (db: D1Database) => {
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
};

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        if (!env.DB) {
            console.error("D1 DB binding missing. Env keys:", Object.keys(env));
            return new Response(JSON.stringify({ error: "DB binding missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        if (request.method === "GET") {
            const id = url.searchParams.get("id");
            if (!id) return new Response("Missing id", { status: 400 });

            try {
                const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
                return new Response(JSON.stringify(user || null), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: users")) {
                    console.warn("Users table missing. Attempting self-healing...");
                    await ensureUsersTable(env.DB);
                    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
                    return new Response(JSON.stringify(user || null), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        if (request.method === "POST") {
            const data: any = await request.json();
            const { id, name, email } = data;

            if (!id || !name || !email) {
                return new Response("Missing required fields (id, name, email)", { status: 400 });
            }

            try {
                await env.DB.prepare(`
                    INSERT INTO users (id, name, email)
                    VALUES (?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      name=excluded.name,
                      email=excluded.email
                `).bind(id, name, email).run();

                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: users")) {
                    console.warn("Users table missing in POST. Attempting self-healing...");
                    await ensureUsersTable(env.DB);
                    await env.DB.prepare(`
                        INSERT INTO users (id, name, email)
                        VALUES (?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                          name=excluded.name,
                          email=excluded.email
                    `).bind(id, name, email).run();
                    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in users.ts:", e.message);
        return new Response(JSON.stringify({
            error: e.message,
            stack: e.stack
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
