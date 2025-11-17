import { getCustomProductsByCategories } from "@/lib/data/custom-products"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: "Categorías de Productos Personalizables | Tu Tienda",
    description:
      "Explora nuestras categorías de productos personalizables organizadas por tipo y uso. Pegatinas, etiquetas y más.",
  }
}

export default async function CategoriasPersonalizablesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  let categoriesData = null
  let error = null

  try {
    categoriesData = await getCustomProductsByCategories()
  } catch (err) {
    error = err instanceof Error ? err.message : "Error desconocido"
    console.error("[CategoriasPersonalizablesPage] Error:", err)
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Categorías de Productos Personalizables
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Error al cargar categorías: {error}</p>
            <p className="text-sm text-red-500 mt-2">
              Verifica que el backend esté funcionando y que haya productos
              configurados.
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!categoriesData || categoriesData.categories.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Categorías de Productos Personalizables
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-600">
              No hay categorías de productos personalizables disponibles.
            </p>
            <p className="text-sm text-blue-500 mt-2">
              Crea productos en el Admin de Medusa y añade metadata de
              categoría y subcategoría.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const { categories, totalCategories, totalSubcategories, totalProducts } =
    categoriesData

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href={`/${locale}`}
              className="text-gray-600 hover:text-primary"
            >
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">
            Categorías Personalizables
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Categorías de Productos Personalizables
        </h1>
        <p className="text-lg text-gray-600">
          Explora nuestra colección organizada por categorías y subcategorías.
          Encuentra exactamente lo que necesitas.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📦 {totalProducts} productos</span>
          <span>🏷️ {totalCategories} categorías</span>
          <span>📂 {totalSubcategories} subcategorías</span>
        </div>
      </div>

      {/* Categorías */}
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.category} className="space-y-6">
            {/* Header de categoría */}
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {category.totalProducts} productos en{" "}
                {category.subcategories.length} subcategorías
              </div>
            </div>

            {/* Subcategorías */}
            <div className="space-y-8">
              {category.subcategories.map((subcategory) => (
                <div key={subcategory.subcategory}>
                  {/* Header de subcategoría */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-1">
                      {subcategory.name}
                    </h3>
                    {subcategory.description && (
                      <p className="text-sm text-gray-600">
                        {subcategory.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {subcategory.products.length} productos
                    </div>
                  </div>

                  {/* Grid de productos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {subcategory.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/${locale}/products/${product.handle}`}
                        className="group bg-white rounded-lg border hover:border-primary transition-all overflow-hidden hover:shadow-lg"
                      >
                        {/* Imagen */}
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-16 h-16 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}

                          {/* Badge */}
                          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                            ⚙️ Personalizable
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-3">
                          <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {product.title}
                          </h4>

                          {/* Configuración */}
                          <div className="space-y-1 mb-2">
                            {product.configurator_config.materials.length >
                              0 && (
                              <div className="text-xs text-gray-500">
                                {product.configurator_config.materials.length}{" "}
                                materiales
                              </div>
                            )}
                            {product.configurator_config.sizes.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {product.configurator_config.sizes.length}{" "}
                                tamaños
                              </div>
                            )}
                          </div>

                          {/* Precio */}
                          {product.configurator_config.quantities.length >
                            0 && (
                            <div className="text-xs text-gray-600 mb-2">
                              Desde{" "}
                              <span className="font-bold text-primary">
                                €
                                {Math.min(
                                  ...product.configurator_config.quantities.map(
                                    (q: any) => q.basePrice
                                  )
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center text-primary text-xs font-medium">
                            Personalizar
                            <svg
                              className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">
          ¿Necesitas ayuda para elegir?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <div className="font-medium mb-1">📞 Contacto</div>
            <div>
              Nuestro equipo está disponible para ayudarte a elegir el producto
              perfecto
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">💡 Asesoramiento</div>
            <div>
              Te ayudamos a configurar tu producto según tus necesidades
              específicas
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
