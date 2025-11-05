import type {
  MiddlewaresConfig,
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/medusa";

/**
 * Validates that published products have required SEO fields
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */
async function validateSeoFields(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const { status, seo_title, seo_description } = req.body;

  // Only validate if the product is being published
  if (status === "published") {
    // Check if seo_title is missing, null, or contains only whitespace
    if (!seo_title || !seo_title.trim()) {
      return res.status(400).json({
        message: "seo_title is required for published products",
        type: "validation_error",
      });
    }

    // Check if seo_description is missing, null, or contains only whitespace
    if (!seo_description || !seo_description.trim()) {
      return res.status(400).json({
        message: "seo_description is required for published products",
        type: "validation_error",
      });
    }
  }

  next();
}

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/admin/products",
      middlewares: [validateSeoFields],
    },
    {
      matcher: "/admin/products/*",
      middlewares: [validateSeoFields],
    },
  ],
};
