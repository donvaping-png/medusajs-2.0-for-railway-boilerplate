import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import MetaDefinitionService from "../../../../services/meta-definition.service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const metaDefinitionService = req.scope.resolve<MetaDefinitionService>("metaDefinitionService")
  
  const scope = req.query.scope as string || "category"
  const definitions = await metaDefinitionService.list(scope)

  res.json({ definitions })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const metaDefinitionService = req.scope.resolve<MetaDefinitionService>("metaDefinitionService")

  const { scope, key, label, type, required, options, default_value, validations } = req.body as any

  if (!scope || !key || !type) {
    return res.status(400).json({
      message: "Missing required fields: scope, key, type",
    })
  }

  const validTypes = ["text", "richtext", "number", "boolean", "date", "select", "json", "image"]
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
    })
  }

  try {
    const definition = await metaDefinitionService.createOrUpdate({
      scope,
      key,
      label,
      type,
      required,
      options,
      default_value,
      validations,
    })

    res.json({ definition })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create or update definition",
      error: error.message,
    })
  }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const metaDefinitionService = req.scope.resolve<MetaDefinitionService>("metaDefinitionService")

  const scope = req.query.scope as string || "category"
  const key = req.query.key as string

  if (!key) {
    return res.status(400).json({
      message: "Missing required query parameter: key",
    })
  }

  try {
    await metaDefinitionService.remove(scope, key)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete definition",
      error: error.message,
    })
  }
}
