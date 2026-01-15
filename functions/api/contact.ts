interface Env {
    DB: D1Database;
}

const ensureContactTable = async (db: D1Database) => {
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            subject TEXT,
            message TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
};

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        if (request.method === "GET") {
            if (!env.DB) {
                return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
            }

            try {
                const { results } = await env.DB.prepare("SELECT * FROM contact_messages ORDER BY createdAt DESC").all();
                return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: contact_messages")) {
                    console.warn("Contact table missing. Attempting self-healing...");
                    await ensureContactTable(env.DB);
                    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        if (request.method === "POST") {
            if (!env.DB) {
                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            }

            const data: any = await request.json();
            const { name, email, subject, message } = data;

            try {
                await env.DB.prepare(`
                    INSERT INTO contact_messages (id, name, email, subject, message)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(
                    crypto.randomUUID(),
                    name || null,
                    email || null,
                    subject || null,
                    message || null
                ).run();

                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: contact_messages")) {
                    console.warn("Contact table missing in POST. Attempting self-healing...");
                    await ensureContactTable(env.DB);
                    await env.DB.prepare(`
                        INSERT INTO contact_messages (id, name, email, subject, message)
                        VALUES (?, ?, ?, ?, ?)
                    `).bind(
                        crypto.randomUUID(),
                        name || null,
                        email || null,
                        subject || null,
                        message || null
                    ).run();
                    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in contact.ts:", e.message);
        return new Response(JSON.stringify({
            error: e.message
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
