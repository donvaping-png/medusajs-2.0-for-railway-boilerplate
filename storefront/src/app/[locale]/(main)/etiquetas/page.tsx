import { getCategory, getSubcategories } from "@/config/sticker-categories"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const category = getCategory("etiquetas")

  return {
    title: `${category?.name} Personalizadas | Tu Tienda`,
    description: category?.description || "Etiquetas personalizadas de alta calidad",
  }
}

export default async function EtiquetasPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const category = getCategory("etiquetas")
  const subcategories = getSubcategories("etiquetas")

  if (!category) {
    return <div>Categoría no encontrada</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link href={`/${locale}`} className="text-gray-600 hover:text-primary">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
        <p className="text-lg text-gray-600">{category.description}</p>
      </div>

      {/* Subcategorías Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/${locale}/etiquetas/${subcategory.slug}`}
            className="group bg-white rounded-lg border hover:border-primary transition-all overflow-hidden hover:shadow-lg"
          >
            {subcategory.image && (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={subcategory.image}
                  alt={subcategory.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {subcategory.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {subcategory.description}
              </p>
              <div className="flex items-center text-primary text-sm font-medium">
                Configurar
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
    </main>
  )
}
