import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"

export const stickerCategories: { id: number; name: string; handle: string }[] = [
  {
    id: 1,
    name: "Personalizadas",
    handle: "custom-stickers",
  },
  {
    id: 2,
    name: "Logos y Marcas",
    handle: "logo-stickers",
  },
  {
    id: 3,
    name: "Decorativas",
    handle: "decorative-stickers",
  },
  {
    id: 4,
    name: "Vehículos",
    handle: "vehicle-stickers",
  },
  {
    id: 5,
    name: "Troqueladas",
    handle: "die-cut-stickers",
  },
  {
    id: 6,
    name: "Holográficas",
    handle: "holographic-stickers",
  },
]

export const StickerCategories = async ({ heading }: { heading: string }) => {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={stickerCategories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      />
    </section>
  )
}
