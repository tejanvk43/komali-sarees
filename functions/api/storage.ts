interface Env {
    BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // GET /api/storage?path=products/filename.jpg
    if (request.method === "GET") {
        try {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            const object = await env.BUCKET.get(path);
            if (!object) return new Response("Object not found", { status: 404 });

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set("etag", object.httpEtag);

            return new Response(object.body, { headers });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    // POST /api/storage?path=products/filename.jpg
    if (request.method === "POST") {
        try {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            const file = await request.arrayBuffer();
            const contentType = request.headers.get("content-type") || "application/octet-stream";

            await env.BUCKET.put(path, file, {
                httpMetadata: { contentType }
            });

            // Return a relative URL that goes through our GET handler
            const publicUrl = `/api/storage?path=${encodeURIComponent(path)}`;

            return new Response(JSON.stringify({ success: true, url: publicUrl }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    // DELETE /api/storage?path=products/filename.jpg
    if (request.method === "DELETE") {
        try {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            await env.BUCKET.delete(path);
            return new Response(JSON.stringify({ success: true }));
        } catch (e: any) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
};
