import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * PATCH /admin/products/:id
 * Updates an existing product with SEO fields
 * Requirements: 2.4, 2.5, 2.6, 2.7
 */
export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(
      Modules.PRODUCT
    );

    const { id } = req.params;
    const {
      seo_title,
      seo_description,
      short_description,
      ...productData
    } = req.body;

    // Update product with SEO fields
    const product = await productModuleService.updateProducts(id, {
      ...productData,
      seo_title,
      seo_description,
      short_description,
    });

    res.json({ product });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while updating the product",
      type: "server_error",
    });
  }
}
