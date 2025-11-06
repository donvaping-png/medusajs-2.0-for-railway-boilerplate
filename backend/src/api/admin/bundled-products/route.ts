import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  createBundledProductWorkflow,
  CreateBundledProductWorkflowInput,
} from "../../../workflows/create-bundled-product"

export type PostBundledProductsType = {
  title: string
  product: any
  items: {
    product_id: string
    quantity: number
  }[]
}

export async function POST(
  req: AuthenticatedMedusaRequest<PostBundledProductsType>,
  res: MedusaResponse
) {
  const { result: bundledProduct } = await createBundledProductWorkflow(
    req.scope
  ).run({
    input: {
      bundle: req.validatedBody,
    } as CreateBundledProductWorkflowInput,
  })

  res.json({
    bundled_product: bundledProduct,
  })
}

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const {
    data: bundledProducts,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "bundle",
    ...req.queryConfig,
  })

  res.json({
    bundled_products: bundledProducts,
    count: count || 0,
    limit: take || 15,
    offset: skip || 0,
  })
}
