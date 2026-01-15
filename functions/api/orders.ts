interface Env {
    DB: D1Database;
}

const ensureOrdersTable = async (db: D1Database) => {
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            userId TEXT,
            customerName TEXT,
            customerEmail TEXT,
            customerPhone TEXT,
            shippingAddress TEXT,
            customization TEXT,
            items TEXT,
            totalAmount REAL,
            status TEXT DEFAULT 'pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
};

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        if (!env.DB) {
            console.warn("D1 DB binding missing in orders.");
            return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
        }

        if (request.method === "GET") {
            try {
                const userId = url.searchParams.get("userId");
                let query = "SELECT * FROM orders ORDER BY createdAt DESC";
                let params: any[] = [];

                if (userId) {
                    query = "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC";
                    params = [userId];
                }

                const { results } = await env.DB.prepare(query).bind(...params).all();

                const orders = results.map(o => ({
                    ...o,
                    items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
                }));

                return new Response(JSON.stringify(orders), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: orders")) {
                    console.warn("Orders table missing. Attempting self-healing...");
                    await ensureOrdersTable(env.DB);
                    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
                }
                console.error("Orders GET Query Error:", queryErr.message);
                return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
            }
        }

        if (request.method === "POST") {
            const data: any = await request.json();
            const orderId = data.id || crypto.randomUUID();
            const {
                userId, customerName, customerEmail, customerPhone,
                shippingAddress, customization, items, totalAmount
            } = data;

            try {
                await env.DB.prepare(`
                    INSERT INTO orders (id, userId, customerName, customerEmail, customerPhone, shippingAddress, customization, items, totalAmount)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    orderId,
                    userId || null,
                    customerName || null,
                    customerEmail || null,
                    customerPhone || null,
                    shippingAddress || null,
                    customization || null,
                    JSON.stringify(items || []),
                    totalAmount || 0
                ).run();
                return new Response(JSON.stringify({ success: true, id: orderId }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: orders")) {
                    console.warn("Orders table missing in POST. Attempting self-healing...");
                    await ensureOrdersTable(env.DB);
                    await env.DB.prepare(`
                        INSERT INTO orders (id, userId, customerName, customerEmail, customerPhone, shippingAddress, customization, items, totalAmount)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        orderId,
                        userId || null,
                        customerName || null,
                        customerEmail || null,
                        customerPhone || null,
                        shippingAddress || null,
                        customization || null,
                        JSON.stringify(items || []),
                        totalAmount || 0
                    ).run();
                    return new Response(JSON.stringify({ success: true, id: orderId }), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        if (request.method === "PATCH") {
            const data: any = await request.json();
            const { id, status } = data;

            if (!id || !status) {
                return new Response("Missing id or status", { status: 400 });
            }

            try {
                await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?")
                    .bind(status, id).run();
                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                console.error("Orders PATCH Error:", queryErr.message);
                throw queryErr;
            }
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in orders.ts:", e.message);
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
