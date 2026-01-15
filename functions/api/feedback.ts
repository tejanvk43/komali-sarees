interface Env {
    DB: D1Database;
}

const ensureFeedbackTable = async (db: D1Database) => {
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            userId TEXT,
            userName TEXT,
            userEmail TEXT,
            rating INTEGER,
            suggestion TEXT,
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
                const { results } = await env.DB.prepare("SELECT * FROM feedback ORDER BY createdAt DESC").all();
                return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: feedback")) {
                    console.warn("Feedback table missing. Attempting self-healing...");
                    await ensureFeedbackTable(env.DB);
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
            const { userId, userName, userEmail, rating, suggestion } = data;

            try {
                await env.DB.prepare(`
                    INSERT INTO feedback (id, userId, userName, userEmail, rating, suggestion)
                    VALUES (?, ?, ?, ?, ?, ?)
                `).bind(
                    crypto.randomUUID(),
                    userId || null,
                    userName || null,
                    userEmail || null,
                    rating || 0,
                    suggestion || null
                ).run();

                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: feedback")) {
                    console.warn("Feedback table missing in POST. Attempting self-healing...");
                    await ensureFeedbackTable(env.DB);
                    await env.DB.prepare(`
                        INSERT INTO feedback (id, userId, userName, userEmail, rating, suggestion)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `).bind(
                        crypto.randomUUID(),
                        userId || null,
                        userName || null,
                        userEmail || null,
                        rating || 0,
                        suggestion || null
                    ).run();
                    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in feedback.ts:", e.message);
        return new Response(JSON.stringify({
            error: e.message,
            stack: e.stack
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
