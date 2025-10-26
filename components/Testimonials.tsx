import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Maria Silva',
      service: 'Eletricista',
      rating: 5,
      comment: 'Excelente profissional! Resolveu o problema rapidamente e com qualidade.'
    },
    {
      name: 'João Santos',
      service: 'Canalizador',
      rating: 5,
      comment: 'Muito competente e pontual. Recomendo para todos os serviços de canalização.'
    },
    {
      name: 'Ana Costa',
      service: 'Limpeza',
      rating: 5,
      comment: 'Serviço de limpeza impecável. A casa ficou como nova!'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Milhares de clientes satisfeitos confiam na Elastiquality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.comment}"
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
