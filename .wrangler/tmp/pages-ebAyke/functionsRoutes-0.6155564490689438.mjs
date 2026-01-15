import { onRequest as __api_admins_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\admins.ts"
import { onRequest as __api_feedback_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\feedback.ts"
import { onRequest as __api_orders_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\orders.ts"
import { onRequest as __api_products_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\products.ts"
import { onRequest as __api_storage_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\storage.ts"
import { onRequest as __api_tags_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\tags.ts"
import { onRequest as __api_users_ts_onRequest } from "E:\\SareeCustoms\\functions\\api\\users.ts"

export const routes = [
    {
      routePath: "/api/admins",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_admins_ts_onRequest],
    },
  {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_feedback_ts_onRequest],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_orders_ts_onRequest],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_products_ts_onRequest],
    },
  {
      routePath: "/api/storage",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_storage_ts_onRequest],
    },
  {
      routePath: "/api/tags",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_tags_ts_onRequest],
    },
  {
      routePath: "/api/users",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_users_ts_onRequest],
    },
  ]