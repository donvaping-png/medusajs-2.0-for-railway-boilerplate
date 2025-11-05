import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * POST /admin/products
 * Creates a new product with SEO fields
 * Requirements: 2.1, 2.2, 2.3
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(
      Modules.PRODUCT
    );

    const {
      seo_title,
      seo_description,
      short_description,
      ...productData
    } = req.body;

    // Create product with SEO fields
    const product = await productModuleService.createProducts({
      ...productData,
      seo_title,
      seo_description,
      short_description,
    });

    res.json({ product });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while creating the product",
      type: "server_error",
    });
  }
}
