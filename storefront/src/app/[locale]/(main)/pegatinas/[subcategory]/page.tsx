import { getCategory, getSubcategory } from "@/config/sticker-categories"
import { StickerConfigurator } from "@/components/organisms/StickerConfigurator"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; subcategory: string }>
}): Promise<Metadata> {
  const { subcategory: subcategorySlug } = await params
  const subcategory = getSubcategory("pegatinas", subcategorySlug)

  if (!subcategory) {
    return {
      title: "Subcategoría no encontrada",
    }
  }

  return {
    title: `${subcategory.name} | Pegatinas Personalizadas`,
    description: subcategory.description,
  }
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ locale: string; subcategory: string }>
}) {
  const { locale, subcategory: subcategorySlug } = await params
  const category = getCategory("pegatinas")
  const subcategory = getSubcategory("pegatinas", subcategorySlug)

  if (!category || !subcategory) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href={`/${locale}`} className="text-gray-600 hover:text-primary">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link
              href={`/${locale}/pegatinas`}
              className="text-gray-600 hover:text-primary"
            >
              {category.name}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{subcategory.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {subcategory.name}
        </h1>
        <p className="text-lg text-gray-600">{subcategory.description}</p>
      </div>

      {/* Configurador */}
      <StickerConfigurator
        subcategoryConfig={subcategory}
        categorySlug="pegatinas"
      />
    </main>
  )
}
