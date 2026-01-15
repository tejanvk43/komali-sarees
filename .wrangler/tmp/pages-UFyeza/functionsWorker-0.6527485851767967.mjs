var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-Nc23j0/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// api/admins.ts
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      const uid = url.searchParams.get("id");
      if (!uid) return new Response("Missing id", { status: 400 });
      if (!env.DB) {
        const isAdmin = uid === "j9wP7R0VAZYzoXRVpebzsTq3G9n2" || uid === "admin-mock-id";
        return Response.json({ isAdmin });
      }
      const admin = await env.DB.prepare("SELECT * FROM admins WHERE uid = ?").bind(uid).first();
      return Response.json({ isAdmin: !!admin });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return Response.json({
      error: e.message,
      stack: e.stack,
      envKeys: Object.keys(env || {})
    }, { status: 500 });
  }
}
__name(onRequest, "onRequest");

// api/feedback.ts
async function onRequest2(context) {
  const { request, env } = context;
  try {
    if (request.method === "GET") {
      if (!env.DB) return Response.json([]);
      const { results } = await env.DB.prepare("SELECT * FROM feedback ORDER BY createdAt DESC").all();
      return Response.json(results);
    }
    if (request.method === "POST") {
      if (!env.DB) return Response.json({ success: true });
      const data = await request.json();
      const { userId, userName, userEmail, rating, suggestion } = data;
      await env.DB.prepare(`
                INSERT INTO feedback (id, userId, userName, userEmail, rating, suggestion)
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
        crypto.randomUUID(),
        userId,
        userName,
        userEmail,
        rating,
        suggestion
      ).run();
      return Response.json({ success: true });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return Response.json({
      error: e.message,
      stack: e.stack,
      envKeys: Object.keys(env || {})
    }, { status: 500 });
  }
}
__name(onRequest2, "onRequest");

// api/orders.ts
var onRequest3 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      if (!env.DB) {
        console.warn("D1 DB binding missing in orders GET.");
        return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
      }
      try {
        const userId = url.searchParams.get("userId");
        let query = "SELECT * FROM orders ORDER BY createdAt DESC";
        let params = [];
        if (userId) {
          query = "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC";
          params = [userId];
        }
        const { results } = await env.DB.prepare(query).bind(...params).all();
        const orders = results.map((o) => ({
          ...o,
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items || []
        }));
        return new Response(JSON.stringify(orders), { headers: { "Content-Type": "application/json" } });
      } catch (queryErr) {
        console.error("Orders GET Query Error:", queryErr.message);
        return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
      }
    }
    if (request.method === "POST") {
      if (!env.DB) {
        console.error("D1 DB binding missing in orders POST.");
        return new Response("Database binding missing", { status: 500 });
      }
      const data = await request.json();
      const {
        id,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        customization,
        items,
        totalAmount,
        status
      } = data;
      const orderId = id || crypto.randomUUID();
      await env.DB.prepare(`
                INSERT INTO orders (
                  id, userId, customerName, customerEmail, customerPhone, 
                  shippingAddress, customization, items, totalAmount, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
        orderId,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        customization,
        JSON.stringify(items || []),
        totalAmount,
        status || "pending"
      ).run();
      return new Response(JSON.stringify({ success: true, id: orderId }), { headers: { "Content-Type": "application/json" } });
    }
    if (request.method === "PATCH") {
      if (!env.DB) {
        console.error("D1 DB binding missing in orders PATCH.");
        return new Response("Database binding missing", { status: 500 });
      }
      const data = await request.json();
      const { id, status } = data;
      if (!id || !status) return new Response("Missing id or status", { status: 400 });
      await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    console.error("CRITICAL ERROR in orders.ts:", e.message, e.stack);
    return new Response(JSON.stringify({
      error: e.message,
      stack: e.stack
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}, "onRequest");

// api/products.ts
var onRequest4 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const mockProducts = [
    {
      id: "p1",
      name: "Premium Kanchipuram Silk",
      price: 15e3,
      description: "Traditional silk saree with rich gold work.",
      dressType: "Saree",
      fabric: "Silk",
      color: "Red",
      occasion: "Wedding",
      stock: 5,
      images: ["https://placehold.co/600x400"],
      tags: ["Silk", "Red"]
    },
    {
      id: "p2",
      name: "Soft Cotton Daily Wear",
      price: 2e3,
      description: "Comfortable cotton saree for everyday use.",
      dressType: "Saree",
      fabric: "Cotton",
      color: "Blue",
      occasion: "Casual",
      stock: 10,
      images: ["https://placehold.co/600x400"],
      tags: ["Cotton", "Blue"]
    }
  ];
  try {
    if (request.method === "GET") {
      if (!env.DB) {
        console.warn("D1 DB binding missing in products GET. Returning mock data.");
        return new Response(JSON.stringify(mockProducts), { headers: { "Content-Type": "application/json" } });
      }
      try {
        const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY createdAt DESC").all();
        const products = results.map((p) => {
          try {
            return {
              ...p,
              images: typeof p.images === "string" ? JSON.parse(p.images) : p.images || [],
              tags: typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags || []
            };
          } catch (parseErr) {
            return { ...p, images: [], tags: [] };
          }
        });
        return new Response(JSON.stringify(products), { headers: { "Content-Type": "application/json" } });
      } catch (queryErr) {
        console.error("Products GET Query Error:", queryErr.message);
        return new Response(JSON.stringify(mockProducts), { headers: { "Content-Type": "application/json" } });
      }
    }
    if (request.method === "POST") {
      if (!env.DB) {
        console.error("D1 DB binding missing in products POST.");
        return new Response("Database binding missing", { status: 500 });
      }
      const data = await request.json();
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
        id,
        name,
        price,
        description,
        dressType,
        fabric,
        color,
        occasion,
        stock,
        JSON.stringify(images || []),
        JSON.stringify(tags || [])
      ).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
    if (request.method === "DELETE") {
      if (!env.DB) {
        console.error("D1 DB binding missing in products DELETE.");
        return new Response("Database binding missing", { status: 500 });
      }
      const id = url.searchParams.get("id");
      if (!id) return new Response("Missing id", { status: 400 });
      await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    console.error("CRITICAL ERROR in products.ts:", e.message, e.stack);
    return new Response(JSON.stringify({
      error: e.message,
      stack: e.stack
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}, "onRequest");

// api/storage.ts
async function onRequest5(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      const path = url.searchParams.get("path");
      if (!path) return new Response("Missing path", { status: 400 });
      if (!env.BUCKET) {
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
    if (request.method === "DELETE") {
      if (!env.BUCKET) return Response.json({ success: true });
      const path = url.searchParams.get("path");
      if (!path) return new Response("Missing path", { status: 400 });
      await env.BUCKET.delete(path);
      return Response.json({ success: true });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    return Response.json({
      error: e.message,
      stack: e.stack,
      envKeys: Object.keys(env || {})
    }, { status: 500 });
  }
}
__name(onRequest5, "onRequest");

// api/tags.ts
var onRequest6 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const mockTags = [
    { id: "t1", name: "Silk", category: "Fabric", colorHex: "#8B0000" },
    { id: "t2", name: "Cotton", category: "Fabric", colorHex: "#F0F8FF" },
    { id: "t3", name: "Red", category: "Color", colorHex: "#FF0000" },
    { id: "t4", name: "Blue", category: "Color", colorHex: "#0000FF" }
  ];
  try {
    if (request.method === "GET") {
      if (!env.DB) {
        console.warn("D1 DB binding missing in tags GET. Returning mock data.");
        return new Response(JSON.stringify(mockTags), { headers: { "Content-Type": "application/json" } });
      }
      try {
        const { results } = await env.DB.prepare("SELECT * FROM tags ORDER BY name ASC").all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
      } catch (queryErr) {
        console.error("Tags GET Query Error:", queryErr.message);
        return new Response(JSON.stringify(mockTags), { headers: { "Content-Type": "application/json" } });
      }
    }
    if (request.method === "POST") {
      if (!env.DB) {
        console.error("D1 DB binding missing in tags POST.");
        return new Response("Database binding missing", { status: 500 });
      }
      const data = await request.json();
      const id = data.id || crypto.randomUUID();
      const { name, category, colorHex } = data;
      await env.DB.prepare("INSERT INTO tags (id, name, category, colorHex) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category, colorHex=excluded.colorHex").bind(id, name, category, colorHex || null).run();
      return new Response(JSON.stringify({ success: true, id }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    console.error("CRITICAL ERROR in tags.ts:", e.message, e.stack);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}, "onRequest");

// api/users.ts
var onRequest7 = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  try {
    if (request.method === "GET") {
      const id = url.searchParams.get("id");
      if (!id) return new Response("Missing id", { status: 400 });
      if (!env.DB) {
        console.warn("D1 DB binding missing in users GET. Returning null.");
        return new Response(JSON.stringify(null), { headers: { "Content-Type": "application/json" } });
      }
      const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
      return new Response(JSON.stringify(user || null), { headers: { "Content-Type": "application/json" } });
    }
    if (request.method === "POST") {
      if (!env.DB) {
        console.error("D1 DB binding missing in users POST.");
        return new Response("Database binding missing", { status: 500 });
      }
      const data = await request.json();
      const { id, name, email } = data;
      if (!id || !name || !email) {
        return new Response("Missing required fields (id, name, email)", { status: 400 });
      }
      await env.DB.prepare(`
                INSERT INTO users (id, name, email)
                VALUES (?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name=excluded.name,
                  email=excluded.email
            `).bind(id, name, email).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response("Method not allowed", { status: 405 });
  } catch (e) {
    console.error("CRITICAL ERROR in users.ts:", e.message, e.stack);
    return new Response(JSON.stringify({
      error: e.message,
      stack: e.stack
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}, "onRequest");

// ../.wrangler/tmp/pages-UFyeza/functionsRoutes-0.04345689043510692.mjs
var routes = [
  {
    routePath: "/api/admins",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/feedback",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/orders",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/products",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/storage",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/tags",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/users",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  }
];

// C:/Users/pteja/AppData/Roaming/npm/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// C:/Users/pteja/AppData/Roaming/npm/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// C:/Users/pteja/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/pteja/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-Nc23j0/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// C:/Users/pteja/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-Nc23j0/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.6527485851767967.mjs.map
