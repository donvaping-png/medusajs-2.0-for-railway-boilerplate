import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const CTASection = () => {
  return (
    <section className="bg-action container py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="display-md text-tertiary mb-6">
          ¿LISTO PARA CREAR TUS PEGATINAS?
        </h2>
        <p className="text-xl text-tertiary mb-8">
          Comienza a diseñar ahora y recibe tus pegatinas personalizadas en pocos días. 
          Sin pedido mínimo, calidad garantizada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LocalizedClientLink href="/categories/custom-stickers">
            <Button size="large" variant="filled">
              EMPEZAR AHORA
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/categories">
            <Button size="large" variant="tonal">
              VER EJEMPLOS
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-tertiary">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Envío gratis +50€</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Garantía de calidad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Soporte 24/7</span>
          </div>
        </div>
      </div>
    </section>
  )
}
