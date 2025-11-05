import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import MetaValueService from "../../../services/meta-value.service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const metaValueService = req.scope.resolve<MetaValueService>("metaValueService")
  
  try {
    // Use Medusa's product module to create the category
    const productModuleService = req.scope.resolve(Modules.PRODUCT)
    
    const category = await productModuleService.createProductCategories(req.body)

    // Initialize default meta values for the new category
    await metaValueService.initDefaultsForNewCategory(category.id)

    res.json({ category })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    })
  }
}
