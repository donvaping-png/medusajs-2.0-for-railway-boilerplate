import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import MetaValueService from "../../../../../services/meta-value.service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const metaValueService = req.scope.resolve<MetaValueService>("metaValueService")
  const categoryId = req.params.id

  try {
    const meta = await metaValueService.getByCategoryId(categoryId)
    res.json({ meta })
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve meta fields",
      error: error.message,
    })
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const metaValueService = req.scope.resolve<MetaValueService>("metaValueService")
  const categoryId = req.params.id

  if (typeof req.body !== "object" || Array.isArray(req.body) || req.body === null) {
    return res.status(400).json({
      message: "Request body must be a plain object",
    })
  }

  try {
    const meta = await metaValueService.bulkUpsertCategory(categoryId, req.body)
    res.json({ meta })
  } catch (error) {
    // Check if it's a validation error
    try {
      const errorData = JSON.parse(error.message)
      if (errorData.errors) {
        return res.status(422).json(errorData)
      }
    } catch {
      // Not a JSON error, continue
    }

    res.status(500).json({
      message: "Failed to update meta fields",
      error: error.message,
    })
  }
}
