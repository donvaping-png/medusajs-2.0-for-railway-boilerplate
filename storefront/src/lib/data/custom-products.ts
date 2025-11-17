/**
 * Funciones para obtener productos personalizables desde la API
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export interface CustomProduct {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  status: string
  thumbnail?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  images: any[]
  variants: any[]
  configurator_config: {
    shapes: string[]
    materials: Array<{
      id: string
      name: string
      priceMultiplier: number
    }>
    sizes: Array<{
      label: string
      width: number
      height: number
    }>
    quantities: Array<{
      qty: number
      basePrice: number
    }>
    finishes: Array<{
      id: string
      name: string
    }>
    allowCustomSize: boolean
    minQuantity: number
    maxWidth?: number
    maxHeight?: number
  }
  raw_metadata: Record<string, any>
}

export interface CustomProductsResponse {
  products: CustomProduct[]
  count: number
}

export interface CustomProductResponse {
  product: CustomProduct
}

export interface CategorySubcategory {
  subcategory: string
  name: string
  description: string
  products: CustomProduct[]
}

export interface ProductCategory {
  category: string
  name: string
  description: string
  subcategories: CategorySubcategory[]
  totalProducts: number
}

export interface CategoriesResponse {
  categories: ProductCategory[]
  totalCategories: number
  totalSubcategories: number
  totalProducts: number
}

/**
 * Obtiene todos los productos personalizables
 */
export async function getCustomProducts(): Promise<CustomProductsResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/custom-products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[getCustomProducts] Error:", error)
    throw new Error(
      `Error al obtener productos personalizables: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    )
  }
}

/**
 * Obtiene productos personalizables agrupados por categoría y subcategoría
 */
export async function getCustomProductsByCategories(): Promise<CategoriesResponse> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/store/custom-products/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[getCustomProductsByCategories] Error:", error)
    throw new Error(
      `Error al obtener categorías de productos personalizables: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    )
  }
}

/**
 * Obtiene un producto personalizable específico por handle
 */
export async function getCustomProduct(
  handle: string
): Promise<CustomProduct> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/store/custom-products/${handle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Producto personalizable '${handle}' no encontrado`)
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error(`[getCustomProduct] Error for handle '${handle}':`, error)
    throw new Error(
      `Error al obtener producto personalizable '${handle}': ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    )
  }
}

/**
 * Verifica si un producto es personalizable
 */
export function isCustomProduct(product: any): boolean {
  return product?.metadata?.product_type === "custom_sticker"
}

/**
 * Obtiene la configuración del configurador de un producto
 */
export function getProductConfig(product: any) {
  if (!isCustomProduct(product)) {
    return null
  }

  const parseMetadataField = (field: any) => {
    if (!field) return null
    if (typeof field === "string") {
      try {
        return JSON.parse(field)
      } catch {
        return field
      }
    }
    return field
  }

  return {
    shapes: parseMetadataField(product.metadata?.["config.shapes"]) || [],
    materials:
      parseMetadataField(product.metadata?.["config.materials"]) || [],
    sizes: parseMetadataField(product.metadata?.["config.sizes"]) || [],
    quantities:
      parseMetadataField(product.metadata?.["config.quantities"]) || [],
    finishes: parseMetadataField(product.metadata?.["config.finishes"]) || [],
    allowCustomSize:
      product.metadata?.["config.allowCustomSize"] === "true" ||
      product.metadata?.["config.allowCustomSize"] === true,
    minQuantity: parseInt(product.metadata?.["config.minQuantity"]) || 10,
    maxWidth: parseInt(product.metadata?.["config.maxWidth"]) || null,
    maxHeight: parseInt(product.metadata?.["config.maxHeight"]) || null,
  }
}

/**
 * Filtra productos por categoría (basado en metadata)
 */
export function filterProductsByCategory(
  products: CustomProduct[],
  category: string
): CustomProduct[] {
  return products.filter(
    (product) => product.raw_metadata?.category === category
  )
}

/**
 * Filtra productos por subcategoría
 */
export function filterProductsBySubcategory(
  products: CustomProduct[],
  subcategory: string
): CustomProduct[] {
  return products.filter(
    (product) => product.raw_metadata?.subcategory === subcategory
  )
}

/**
 * Obtiene estadísticas de productos personalizables
 */
export function getCustomProductsStats(products: CustomProduct[]) {
  const categories = new Set(
    products.map((p) => p.raw_metadata?.category).filter(Boolean)
  )
  const subcategories = new Set(
    products.map((p) => p.raw_metadata?.subcategory).filter(Boolean)
  )

  return {
    total: products.length,
    categories: Array.from(categories),
    subcategories: Array.from(subcategories),
    byCategory: Object.fromEntries(
      Array.from(categories).map((cat) => [
        cat,
        filterProductsByCategory(products, cat as string).length,
      ])
    ),
  }
}
