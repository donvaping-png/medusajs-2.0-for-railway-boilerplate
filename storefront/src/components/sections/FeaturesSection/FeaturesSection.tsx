export const FeaturesSection = () => {
  const features = [
    {
      icon: "🎨",
      title: "Diseño Ilimitado",
      description: "Cualquier diseño, cualquier color, sin límites creativos",
    },
    {
      icon: "💎",
      title: "Calidad Premium",
      description: "Vinilo de alta calidad con acabados profesionales",
    },
    {
      icon: "🚚",
      title: "Envío Rápido",
      description: "Producción y envío en 3-5 días hábiles",
    },
    {
      icon: "💧",
      title: "Resistente",
      description: "Impermeable y resistente a rayos UV",
    },
    {
      icon: "✂️",
      title: "Corte Preciso",
      description: "Troquelado perfecto para cualquier forma",
    },
    {
      icon: "💰",
      title: "Mejor Precio",
      description: "Descuentos por cantidad sin comprometer calidad",
    },
  ]

  return (
    <section className="bg-primary container py-12">
      <div className="text-center mb-12">
        <h2 className="display-sm mb-4">¿POR QUÉ ELEGIRNOS?</h2>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Somos especialistas en pegatinas de vinilo personalizadas con años de experiencia
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border rounded-sm p-6 hover:border-action transition-all duration-300 hover:shadow-lg"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
            <p className="text-secondary">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
