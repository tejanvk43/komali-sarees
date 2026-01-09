export async function onRequest(context: { request: Request, env: any }) {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        // GET /api/storage?path=products/filename.jpg
        if (request.method === "GET") {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            if (!env.BUCKET) {
                // Return a placeholder image if R2 is not connected
                const placeholder = await fetch("https://placehold.co/600x400/png?text=Image+Pending+R2");
                return new Response(placeholder.body, { headers: { "Content-Type": "image/png" } });
            }

            const object = await env.BUCKET.get(path);
            if (!object) return new Response("Object not found", { status: 404 });

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set("etag", object.httpEtag);

            return new Response(object.body, { headers });
        }

        // POST /api/storage?path=products/filename.jpg
        if (request.method === "POST") {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            if (!env.BUCKET) {
                return Response.json({ success: true, url: "https://placehold.co/600x400/png?text=Mock+Upload" });
            }

            const file = await request.arrayBuffer();
            const contentType = request.headers.get("content-type") || "application/octet-stream";

            await env.BUCKET.put(path, file, {
                httpMetadata: { contentType }
            });

            const publicUrl = `/api/storage?path=${encodeURIComponent(path)}`;
            return Response.json({ success: true, url: publicUrl });
        }

        // DELETE /api/storage?path=products/filename.jpg
        if (request.method === "DELETE") {
            if (!env.BUCKET) return Response.json({ success: true });

            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            await env.BUCKET.delete(path);
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
