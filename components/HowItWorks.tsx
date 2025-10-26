import { CheckCircle, Users, Shield, Clock } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: '1. Encontre o Profissional',
      description: 'Busque por profissionais certificados na sua área e localização.'
    },
    {
      icon: CheckCircle,
      title: '2. Escolha o Melhor',
      description: 'Compare perfis, avaliações e preços para tomar a melhor decisão.'
    },
    {
      icon: Shield,
      title: '3. Contrate com Segurança',
      description: 'Faça o pagamento de forma segura e acompanhe o progresso do serviço.'
    },
    {
      icon: Clock,
      title: '4. Avalie o Serviço',
      description: 'Deixe sua avaliação e ajude outros clientes a escolherem.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            É simples e rápido encontrar o profissional ideal para o seu serviço
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
