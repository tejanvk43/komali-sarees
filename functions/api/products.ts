export async function onRequest(context: { request: Request, env: any }) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Mock Products Data fallback
    const mockProducts = [
        {
            id: "p1", name: "Premium Kanchipuram Silk", price: 15000,
            description: "Traditional silk saree with rich gold work.",
            dressType: "Saree", fabric: "Silk", color: "Red", occasion: "Wedding",
            stock: 5, images: ["https://placehold.co/600x400"], tags: ["Silk", "Red"]
        },
        {
            id: "p2", name: "Soft Cotton Daily Wear", price: 2000,
            description: "Comfortable cotton saree for everyday use.",
            dressType: "Saree", fabric: "Cotton", color: "Blue", occasion: "Casual",
            stock: 10, images: ["https://placehold.co/600x400"], tags: ["Cotton", "Blue"]
        }
    ];

    try {
        if (request.method === "GET") {
            if (!env.DB) return Response.json(mockProducts);

            const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();

            const products = results.map(p => {
                try {
                    return {
                        ...p,
                        images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
                        tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || [])
                    };
                } catch (parseErr) {
                    return { ...p, images: [], tags: [] };
                }
            });

            return Response.json(products);
        }

        if (request.method === "POST") {
            if (!env.DB) return Response.json({ success: true });

            const data: any = await request.json();
            const { id, name, price, description, dressType, fabric, color, occasion, stock, images, tags } = data;

            await env.DB.prepare(`
                INSERT INTO products (id, name, price, description, dressType, fabric, color, occasion, stock, images, tags)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name=excluded.name,
                  price=excluded.price,
                  description=excluded.description,
                  dressType=excluded.dressType,
                  fabric=excluded.fabric,
                  color=excluded.color,
                  occasion=excluded.occasion,
                  stock=excluded.stock,
                  images=excluded.images,
                  tags=excluded.tags
            `).bind(
                id, name, price, description, dressType, fabric, color, occasion, stock,
                JSON.stringify(images || []), JSON.stringify(tags || [])
            ).run();

            return Response.json({ success: true });
        }

        if (request.method === "DELETE") {
            if (!env.DB) return Response.json({ success: true });

            const id = url.searchParams.get("id");
            if (!id) return new Response("Missing id", { status: 400 });
            await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
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
