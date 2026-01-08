interface Env {
    DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    if (request.method === "GET") {
        try {
            // Check for userId query param for users, or no param for admins
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
                items: JSON.parse(o.items as string || "[]")
            }));

            return new Response(JSON.stringify(orders), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    if (request.method === "POST") {
        try {
            const data: any = await request.json();
            const {
                id, userId, customerName, customerEmail, customerPhone,
                shippingAddress, customization, items, totalAmount, status
            } = data;

            await env.DB.prepare(`
        INSERT INTO orders (
          id, userId, customerName, customerEmail, customerPhone, 
          shippingAddress, customization, items, totalAmount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
                id || crypto.randomUUID(),
                userId, customerName, customerEmail, customerPhone,
                shippingAddress, customization, JSON.stringify(items),
                totalAmount, status || 'pending'
            ).run();

            return new Response(JSON.stringify({ success: true, id }));
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    if (request.method === "PATCH") {
        try {
            const data: any = await request.json();
            const { id, status } = data;
            await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
            return new Response(JSON.stringify({ success: true }));
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
};
