import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"
import { STICKER_CATEGORIES } from "@/config/sticker-categories"

interface ConfigurableStickerCategoriesProps {
  heading: string
  locale: string
}

export async function ConfigurableStickerCategories({
  heading,
  locale,
}: ConfigurableStickerCategoriesProps) {
  // Convertir las categorías principales a formato compatible con CategoryCard
  const categories = Object.values(STICKER_CATEGORIES).map((category, index) => ({
    id: index + 1,
    name: category.name,
    handle: category.slug,
  }))

  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={categories?.map((category) => (
          <CategoryCard key={category.id} category={category} locale={locale} />
        ))}
      />
    </section>
  )
}
