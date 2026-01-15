interface Env {
    DB: D1Database;
}

const ensureTagsTable = async (db: D1Database) => {
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            colorHex TEXT
        )
    `).run();
};

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const mockTags = [
        { id: "t1", name: "Silk", category: "Fabric", colorHex: "#8B0000" },
        { id: "t2", name: "Cotton", category: "Fabric", colorHex: "#F0F8FF" }
    ];

    try {
        if (!env.DB) {
            console.warn("D1 DB binding missing in tags. Returning mock data.");
            return new Response(JSON.stringify(mockTags), { headers: { "Content-Type": "application/json" } });
        }

        if (request.method === "GET") {
            try {
                const { results } = await env.DB.prepare("SELECT * FROM tags ORDER BY name ASC").all();
                return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: tags")) {
                    console.warn("Tags table missing. Attempting self-healing...");
                    await ensureTagsTable(env.DB);
                    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
                }
                console.error("Tags GET Query Error:", queryErr.message);
                return new Response(JSON.stringify(mockTags), { headers: { "Content-Type": "application/json" } });
            }
        }

        if (request.method === "POST") {
            const data: any = await request.json();
            const id = data.id || crypto.randomUUID();
            const { name, category, colorHex } = data;

            try {
                await env.DB.prepare("INSERT INTO tags (id, name, category, colorHex) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category, colorHex=excluded.colorHex")
                    .bind(id, name, category, colorHex || null).run();
                return new Response(JSON.stringify({ success: true, id }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: tags")) {
                    console.warn("Tags table missing in POST. Attempting self-healing...");
                    await ensureTagsTable(env.DB);
                    await env.DB.prepare("INSERT INTO tags (id, name, category, colorHex) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category, colorHex=excluded.colorHex")
                        .bind(id, name, category, colorHex || null).run();
                    return new Response(JSON.stringify({ success: true, id }), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in tags.ts:", e.message);
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
