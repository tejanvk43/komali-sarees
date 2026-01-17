interface Env {
    DB: D1Database;
}

const ensureProductsTable = async (db: D1Database) => {
    await db.prepare(`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            dressType TEXT,
            fabric TEXT,
            color TEXT,
            occasion TEXT,
            stock INTEGER DEFAULT 0,
            images TEXT,
            tags TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
};

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    const mockProducts = [
        {
            id: "p1", name: "Premium Silk", price: 15000,
            description: "Traditional silk saree.",
            dressType: "Saree", fabric: "Silk", color: "Red", occasion: "Wedding",
            stock: 5, images: ["https://placehold.co/600x400"], tags: ["Silk", "Red"]
        }
    ];

    try {
        if (!env.DB) {
            console.warn("D1 DB binding missing in products. Returning mock data.");
            return new Response(JSON.stringify(mockProducts), { headers: { "Content-Type": "application/json" } });
        }

        if (request.method === "GET") {
            try {
                const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();
                const products = results.map(p => ({
                    ...p,
                    images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
                    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || [])
                }));
                return new Response(JSON.stringify(products), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: products")) {
                    console.warn("Products table missing. Attempting self-healing...");
                    await ensureProductsTable(env.DB);
                    return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
                }
                console.error("Products GET Query Error:", queryErr.message);
                return new Response(JSON.stringify(mockProducts), { headers: { "Content-Type": "application/json" } });
            }
        }

        if (request.method === "POST") {
            const data: any = await request.json();
            const productId = data.id || crypto.randomUUID();
            const { name, price, description, dressType, fabric, color, occasion, stock, images, tags } = data;

            try {
                await env.DB.prepare(`
                    INSERT INTO products (id, name, price, description, dressType, fabric, color, occasion, stock, images, tags)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      name=excluded.name, price=excluded.price, description=excluded.description,
                      dressType=excluded.dressType, fabric=excluded.fabric, color=excluded.color,
                      occasion=excluded.occasion, stock=excluded.stock, images=excluded.images, tags=excluded.tags
                `).bind(
                    productId,
                    name || "",
                    price || 0,
                    description || null,
                    dressType || null,
                    fabric || null,
                    color || null,
                    occasion || null,
                    stock || 0,
                    JSON.stringify(images || []),
                    JSON.stringify(tags || [])
                ).run();
                return new Response(JSON.stringify({ success: true, id: productId }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                if (queryErr.message.includes("no such table: products")) {
                    console.warn("Products table missing in POST. Attempting self-healing...");
                    await ensureProductsTable(env.DB);
                    await env.DB.prepare(`
                        INSERT INTO products (id, name, price, description, dressType, fabric, color, occasion, stock, images, tags)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(id) DO UPDATE SET
                          name=excluded.name, price=excluded.price, description=excluded.description,
                          dressType=excluded.dressType, fabric=excluded.fabric, color=excluded.color,
                          occasion=excluded.occasion, stock=excluded.stock, images=excluded.images, tags=excluded.tags
                    `).bind(
                        productId,
                        name || "",
                        price || 0,
                        description || null,
                        dressType || null,
                        fabric || null,
                        color || null,
                        occasion || null,
                        stock || 0,
                        JSON.stringify(images || []),
                        JSON.stringify(tags || [])
                    ).run();
                    return new Response(JSON.stringify({ success: true, id: productId }), { headers: { "Content-Type": "application/json" } });
                }
                throw queryErr;
            }
        }

        if (request.method === "DELETE") {
            const id = url.searchParams.get("id");
            if (!id) return new Response("Missing id", { status: 400 });

            try {
                await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            } catch (queryErr: any) {
                console.error("Products DELETE Query Error:", queryErr.message);
                throw queryErr;
            }
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in products.ts:", e.message);
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
