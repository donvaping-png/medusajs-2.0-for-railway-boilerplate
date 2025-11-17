import { ProductDetails, ProductGallery } from "@/components/organisms"
import { StickerConfigurator } from "@/components/organisms/StickerConfigurator"
import { listProducts } from "@/lib/data/products"
import { HomeProductSection } from "../HomeProductSection/HomeProductSection"
import { getSubcategory } from "@/config/sticker-categories"
import NotFound from "@/app/not-found"

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
    forceCache: true,
  }).then(({ response }) => response.products[0])

  if (!prod) return null

  // Detectar si es un producto personalizable
  const isCustomProduct = prod.metadata?.product_type === "custom_sticker"
  
  // Si es un producto personalizable, mostrar el configurador
  if (isCustomProduct) {
    // Parsear configuración desde metadata
    // Medusa guarda los campos como strings, necesitamos parsearlos
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

    const productConfig = {
      shapes: parseMetadataField(prod.metadata?.["config.shapes"]),
      materials: parseMetadataField(prod.metadata?.["config.materials"]),
      sizes: parseMetadataField(prod.metadata?.["config.sizes"]),
      quantities: parseMetadataField(prod.metadata?.["config.quantities"]),
      finishes: parseMetadataField(prod.metadata?.["config.finishes"]),
      allowCustomSize:
        prod.metadata?.["config.allowCustomSize"] === "true" ||
        prod.metadata?.["config.allowCustomSize"] === true,
      minQuantity:
        parseInt(prod.metadata?.["config.minQuantity"] as string) || 10,
      maxWidth:
        parseInt(prod.metadata?.["config.maxWidth"] as string) || undefined,
      maxHeight:
        parseInt(prod.metadata?.["config.maxHeight"] as string) || undefined,
    }
    
    // DEBUG: Ver qué llega del backend
    console.log("=== DEBUG CONFIGURADOR ===")
    console.log("Product metadata:", prod.metadata)
    console.log("Parsed config:", productConfig)
    console.log("Shapes:", productConfig.shapes)
    console.log("Materials:", productConfig.materials)
    console.log("Sizes:", productConfig.sizes)
    console.log("Quantities:", productConfig.quantities)
    console.log("========================")
    
    // Si tiene configuración en metadata, usarla
    if (productConfig.shapes && productConfig.materials && productConfig.sizes) {
      // Convertir la configuración del producto a formato del configurador
      const subcategoryConfig = {
        id: prod.handle || "",
        name: prod.title || "",
        slug: prod.handle || "",
        description: prod.description || "",
        allowedTypes: [{ id: "standard", name: "Estándar" }], // Siempre hay un tipo por defecto
        allowedShapes: (productConfig.shapes || []).map((shape: string) => ({
          id: shape,
          name:
            shape.charAt(0).toUpperCase() + shape.slice(1).replace(/_/g, " "),
        })),
        allowedMaterials: productConfig.materials || [],
        allowedFinishes: productConfig.finishes || [], // Ahora viene del metadata
        presetSizes: productConfig.sizes || [],
        allowCustomSize: productConfig.allowCustomSize || false,
        quantitySteps: (productConfig.quantities || []).map((q: any) => q.qty),
        minQuantity: productConfig.minQuantity || 10,
        maxWidth: productConfig.maxWidth,
        maxHeight: productConfig.maxHeight,
        priceTable: productConfig.quantities || [],
      }
      return (
        <div className="py-8">
          {/* Breadcrumb y título */}
          <div className="mb-8">
            <nav className="text-sm mb-4">
              <ol className="flex items-center gap-2">
                <li>
                  <a
                    href={`/${locale}`}
                    className="text-gray-600 hover:text-primary"
                  >
                    Inicio
                  </a>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <a
                    href={`/${locale}/categories`}
                    className="text-gray-600 hover:text-primary"
                  >
                    Productos
                  </a>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">{prod.title}</li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {prod.title}
            </h1>
            {prod.description && (
              <p className="text-lg text-gray-600">{prod.description}</p>
            )}
          </div>

          {/* Configurador */}
          <StickerConfigurator
            subcategoryConfig={subcategoryConfig}
            categorySlug="custom"
            productId={prod.id}
            priceTable={productConfig.quantities}
          />
        </div>
      )
    }

    // Fallback: usar configuración estática si no hay metadata
    const category = prod.metadata?.category as string
    const subcategorySlug = prod.metadata?.subcategory as string

    if (category && subcategorySlug) {
      const subcategoryConfig = getSubcategory(category, subcategorySlug)

      if (subcategoryConfig) {
        return (
          <div className="py-8">
            <div className="mb-8">
              <nav className="text-sm mb-4">
                <ol className="flex items-center gap-2">
                  <li>
                    <a
                      href={`/${locale}`}
                      className="text-gray-600 hover:text-primary"
                    >
                      Inicio
                    </a>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li>
                    <a
                      href={`/${locale}/${category}`}
                      className="text-gray-600 hover:text-primary"
                    >
                      {category === "pegatinas" ? "Pegatinas" : "Etiquetas"}
                    </a>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-900 font-medium">
                    {subcategoryConfig.name}
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {prod.title}
              </h1>
              {prod.description && (
                <p className="text-lg text-gray-600">{prod.description}</p>
              )}
            </div>

            <StickerConfigurator
              subcategoryConfig={subcategoryConfig}
              categorySlug={category}
              productId={prod.id}
            />
          </div>
        )
      }
    }
  }

  // Si no es personalizable, mostrar la página de producto normal
  return (
    <>
      <div className="flex flex-col md:flex-row lg:gap-12">
        <div className="md:w-1/2 md:px-2">
          <ProductGallery images={prod?.images || []} />
        </div>
        <div className="md:w-1/2 md:px-2">
          <ProductDetails product={prod} locale={locale} />
        </div>
      </div>
    </>
  )
}
