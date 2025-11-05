export const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Elige tu diseño",
      description: "Sube tu imagen o elige de nuestra galería",
    },
    {
      number: "02",
      title: "Personaliza",
      description: "Selecciona tamaño, forma y acabado",
    },
    {
      number: "03",
      title: "Revisa y confirma",
      description: "Verifica tu diseño antes de ordenar",
    },
    {
      number: "04",
      title: "Recibe en casa",
      description: "Envío rápido y seguro a tu puerta",
    },
  ]

  return (
    <section className="bg-content container py-12">
      <div className="text-center mb-12">
        <h2 className="display-sm mb-4">PROCESO SIMPLE Y RÁPIDO</h2>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Crear tus pegatinas personalizadas nunca fue tan fácil. 
          Sigue estos 4 pasos y tendrás tus diseños en pocos días.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative border rounded-sm p-6 hover:border-action transition-colors"
          >
            <div className="text-6xl font-bold text-action/20 mb-4">
              {step.number}
            </div>
            <h3 className="font-bold text-xl mb-3">{step.title}</h3>
            <p className="text-secondary">{step.description}</p>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-action/30" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
