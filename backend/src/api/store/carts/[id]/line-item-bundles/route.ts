import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { addBundleToCartWorkflow } from "../../../../../workflows/add-bundle-to-cart"

export type PostCartsBundledLineItemsType = {
  bundle_id: string
  quantity?: number
  items: {
    item_id: string
    variant_id: string
  }[]
}

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
