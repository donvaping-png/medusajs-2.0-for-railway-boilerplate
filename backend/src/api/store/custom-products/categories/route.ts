import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /store/custom-products/categories
 * Obtiene productos personalizables agrupados por categoría y subcategoría
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Obtener todos los productos personalizables
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "subtitle",
        "description",
        "handle",
        "status",
        "thumbnail",
        "metadata",
        "created_at",
        "updated_at",
        "images.*",
        "variants.*",
        "variants.prices.*",
      ],
      filters: {
        status: "published",
        "metadata.product_type": "custom_sticker",
      },
    })

    // Función para parsear metadata
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

    // Procesar y agrupar productos
    const categoriesMap = new Map<string, any>()

    products.forEach((product: any) => {
      const category = product.metadata?.category || "otros"
      const subcategory = product.metadata?.subcategory || "general"

      // Parsear configuración
      const config = {
        shapes: parseMetadataField(product.metadata?.["config.shapes"]) || [],
        materials: parseMetadataField(product.metadata?.["config.materials"]) || [],
        sizes: parseMetadataField(product.metadata?.["config.sizes"]) || [],
        quantities: parseMetadataField(product.metadata?.["config.quantities"]) || [],
        finishes: parseMetadataField(product.metadata?.["config.finishes"]) || [],
        allowCustomSize:
          product.metadata?.["config.allowCustomSize"] === "true" ||
          product.metadata?.["config.allowCustomSize"] === true,
        minQuantity: parseInt(product.metadata?.["config.minQuantity"]) || 10,
        maxWidth: parseInt(product.metadata?.["config.maxWidth"]) || null,
        maxHeight: parseInt(product.metadata?.["config.maxHeight"]) || null,
      }

      // Crear estructura de categoría si no existe
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, {
          category,
          name: getCategoryName(category),
          description: getCategoryDescription(category),
          subcategories: new Map<string, any>(),
          totalProducts: 0,
        })
      }

      const categoryData = categoriesMap.get(category)

      // Crear estructura de subcategoría si no existe
      if (!categoryData.subcategories.has(subcategory)) {
        categoryData.subcategories.set(subcategory, {
          subcategory,
          name: getSubcategoryName(subcategory),
          description: getSubcategoryDescription(subcategory),
          products: [],
        })
      }

      // Añadir producto a la subcategoría
      categoryData.subcategories.get(subcategory).products.push({
        ...product,
        configurator_config: config,
        raw_metadata: product.metadata,
      })

      categoryData.totalProducts++
    })

    // Convertir Maps a arrays para la respuesta
    const categories = Array.from(categoriesMap.values()).map((cat) => ({
      ...cat,
      subcategories: Array.from(cat.subcategories.values()),
    }))

    // Ordenar categorías y subcategorías
    categories.sort((a, b) => a.category.localeCompare(b.category))
    categories.forEach((cat) => {
      cat.subcategories.sort((a: any, b: any) =>
        a.subcategory.localeCompare(b.subcategory)
      )
    })

    res.json({
      categories,
      totalCategories: categories.length,
      totalSubcategories: categories.reduce(
        (sum, cat) => sum + cat.subcategories.length,
        0
      ),
      totalProducts: products.length,
    })
  } catch (error) {
    console.error("[GET /store/custom-products/categories] Error:", error)
    res.status(500).json({
      error: "Error al obtener categorías de productos personalizables",
      message: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

// Funciones helper para nombres y descripciones
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    pegatinas: "Pegatinas",
    etiquetas: "Etiquetas",
    vinilos: "Vinilos",
    otros: "Otros",
  }
  return names[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    pegatinas: "Pegatinas personalizables para todo tipo de superficies",
    etiquetas: "Etiquetas adhesivas para productos y envases",
    vinilos: "Vinilos decorativos y publicitarios",
    otros: "Otros productos personalizables",
  }
  return descriptions[category] || ""
}

function getSubcategoryName(subcategory: string): string {
  const names: Record<string, string> = {
    suelo: "Para el Suelo",
    pared: "Para la Pared",
    cristal: "Para Cristal",
    vehiculos: "Para Vehículos",
    productos: "Para Productos",
    envases: "Para Envases",
    general: "General",
  }
  return (
    names[subcategory] ||
    subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
  )
}

function getSubcategoryDescription(subcategory: string): string {
  const descriptions: Record<string, string> = {
    suelo: "Pegatinas resistentes para suelos",
    pared: "Pegatinas decorativas para paredes",
    cristal: "Pegatinas para ventanas y cristales",
    vehiculos: "Pegatinas para coches, motos y vehículos",
    productos: "Etiquetas para identificar productos",
    envases: "Etiquetas para envases y packaging",
    general: "Productos personalizables generales",
  }
  return descriptions[subcategory] || ""
}
