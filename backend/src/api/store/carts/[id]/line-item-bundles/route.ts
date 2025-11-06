import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/utils"
import { addBundleToCartWorkflow } from "../../../../../workflows/add-bundle-to-cart"

export const PostCartsBundledLineItemsSchema = z.object({
  bundle_id: z.string(),
  quantity: z.number().default(1),
  items: z.array(
    z.object({
      item_id: z.string(),
      variant_id: z.string(),
    })
  ),
}) as z.ZodObject<any, any>

export type PostCartsBundledLineItemsType = z.infer<
  typeof PostCartsBundledLineItemsSchema
>

export async function POST(
  req: MedusaRequest<PostCartsBundledLineItemsType>,
  res: MedusaResponse
) {
  const { result: cart } = await addBundleToCartWorkflow(req.scope).run({
    input: {
      cart_id: req.params.id,
      bundle_id: req.validatedBody.bundle_id,
      quantity: req.validatedBody.quantity || 1,
      items: req.validatedBody.items,
    },
  })

  res.json({
    cart,
  })
}
