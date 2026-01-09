export async function onRequest(context: { request: Request, env: any }) {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        if (request.method === "GET") {
            if (!env.DB) return Response.json([]);

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

            return Response.json(orders);
        }

        if (request.method === "POST") {
            if (!env.DB) return Response.json({ success: true, id: "mock-order-id" });

            const data: any = await request.json();
            const {
                id, userId, customerName, customerEmail, customerPhone,
                shippingAddress, customization, items, totalAmount, status
            } = data;

            const orderId = id || crypto.randomUUID();
            await env.DB.prepare(`
                INSERT INTO orders (
                  id, userId, customerName, customerEmail, customerPhone, 
                  shippingAddress, customization, items, totalAmount, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                orderId,
                userId, customerName, customerEmail, customerPhone,
                shippingAddress, customization, JSON.stringify(items || []),
                totalAmount, status || 'pending'
            ).run();

            return Response.json({ success: true, id: orderId });
        }

        if (request.method === "PATCH") {
            if (!env.DB) return Response.json({ success: true });

            const data: any = await request.json();
            const { id, status } = data;
            await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
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
