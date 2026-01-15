interface Env {
    BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        if (request.method === "GET") {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            if (!env.BUCKET) {
                console.warn("R2 Bucket binding missing in storage GET. Returning placeholder.");
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

        if (request.method === "POST") {
            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            if (!env.BUCKET) {
                console.warn("R2 Bucket binding missing in storage POST. Returning mock URL.");
                return new Response(JSON.stringify({ success: true, url: "https://placehold.co/600x400/png?text=Mock+Upload" }), { headers: { "Content-Type": "application/json" } });
            }

            const file = await request.arrayBuffer();
            const contentType = request.headers.get("content-type") || "application/octet-stream";

            await env.BUCKET.put(path, file, {
                httpMetadata: { contentType }
            });

            const publicUrl = `/api/storage?path=${encodeURIComponent(path)}`;
            return new Response(JSON.stringify({ success: true, url: publicUrl }), { headers: { "Content-Type": "application/json" } });
        }

        if (request.method === "DELETE") {
            if (!env.BUCKET) {
                return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
            }

            const path = url.searchParams.get("path");
            if (!path) return new Response("Missing path", { status: 400 });

            await env.BUCKET.delete(path);
            return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
        }

        return new Response("Method not allowed", { status: 405 });
    } catch (e: any) {
        console.error("CRITICAL ERROR in storage.ts:", e.message);
        return new Response(JSON.stringify({
            error: e.message,
            stack: e.stack
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
