export const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Dueña de Café Local",
      comment: "Las pegatinas con nuestro logo quedaron perfectas. La calidad del vinilo es excelente y han resistido el uso diario sin problemas.",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      role: "Diseñador Freelance",
      comment: "Pedí pegatinas personalizadas para mi laptop y el resultado superó mis expectativas. Los colores son vibrantes y el acabado profesional.",
      rating: 5,
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Organizadora de Eventos",
      comment: "Hicimos 500 pegatinas para una boda y fueron un éxito total. El proceso fue rápido y el servicio al cliente impecable.",
      rating: 5,
    },
  ]

  return (
    <section className="bg-content container py-12">
      <div className="text-center mb-12">
        <h2 className="display-sm mb-4">LO QUE DICEN NUESTROS CLIENTES</h2>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Miles de clientes satisfechos confían en nosotros para sus pegatinas personalizadas
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border rounded-sm p-6 bg-primary hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-action text-xl">★</span>
              ))}
            </div>
            <p className="text-primary mb-6 italic">"{testimonial.comment}"</p>
            <div className="border-t pt-4">
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-secondary">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
