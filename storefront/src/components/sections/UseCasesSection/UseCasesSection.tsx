import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

const useCases = [
  {
    id: 1,
    title: "Branding Empresarial",
    description: "Pegatinas con tu logo para promocionar tu marca",
    image: "/images/use-cases/business.jpg",
    href: "/categories/logo-stickers",
  },
  {
    id: 2,
    title: "Decoración Personal",
    description: "Personaliza tus objetos favoritos con estilo único",
    image: "/images/use-cases/personal.jpg",
    href: "/categories/decorative-stickers",
  },
  {
    id: 3,
    title: "Vehículos",
    description: "Vinilo resistente para coches, motos y bicicletas",
    image: "/images/use-cases/vehicles.jpg",
    href: "/categories/vehicle-stickers",
  },
  {
    id: 4,
    title: "Eventos",
    description: "Pegatinas personalizadas para bodas, fiestas y más",
    image: "/images/use-cases/events.jpg",
    href: "/categories/custom-stickers",
  },
]

export const UseCasesSection = () => {
  return (
    <section className="bg-primary container py-8">
      <h2 className="heading-lg text-primary mb-8 uppercase">
        Pegatinas para cada ocasión
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {useCases.map((useCase) => (
          <LocalizedClientLink
            key={useCase.id}
            href={useCase.href}
            className="group border rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                loading="lazy"
                src={useCase.image}
                alt={useCase.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 group-hover:text-action transition-colors">
                {useCase.title}
              </h3>
              <p className="text-sm text-secondary">{useCase.description}</p>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
