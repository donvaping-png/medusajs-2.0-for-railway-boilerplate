import {
  defineMiddlewares,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/bundled-products",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(
          createFindParams(),
          {
            defaults: [
              "id",
              "title",
              "product.*",
              "items.*",
              "items.product.*",
            ],
            isList: true,
            defaultLimit: 15,
          }
        ),
      ],
    },
  ],
})
