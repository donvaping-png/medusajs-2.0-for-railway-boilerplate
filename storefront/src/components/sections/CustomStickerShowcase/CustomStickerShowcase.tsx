import Image from "next/image"
import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const CustomStickerShowcase = () => {
  return (
    <section className="bg-primary container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-sm p-8 flex flex-col justify-between">
          <div>
            <span className="text-sm inline-block px-4 py-1 border border-secondary rounded-sm mb-4">
              #PERSONALIZADO
            </span>
            <h2 className="display-sm mb-4">
              DISEÑA TUS PEGATINAS ÚNICAS
            </h2>
            <p className="text-lg text-primary mb-6">
              Crea pegatinas personalizadas con tus propios diseños. Vinilo de alta calidad, 
              resistente al agua y a los rayos UV. Perfectas para laptops, botellas, coches y más.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-action">✓</span>
                <span>Vinilo premium de larga duración</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-action">✓</span>
                <span>Impresión de alta resolución</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-action">✓</span>
                <span>Resistente al agua y UV</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-action">✓</span>
                <span>Cualquier tamaño y forma</span>
              </li>
            </ul>
          </div>
          <LocalizedClientLink href="/categories/custom-stickers">
            <Button size="large">
              CREAR MI DISEÑO
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="relative aspect-square lg:aspect-auto lg:h-full rounded-sm overflow-hidden">
          <Image
            loading="lazy"
            src="/images/custom-stickers/showcase.jpg"
            alt="Pegatinas de vinilo personalizadas en laptop y botella"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
