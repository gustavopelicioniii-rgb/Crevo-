'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const plans = [
  {
    name: 'Start',
    price: 97,
    credits: 50,
    description: 'Ideal para começar',
    features: [
      '50 créditos',
      'Modelos: Kling, Gemini',
      'Resolução: até 720p',
      '10 templates',
      'Histórico: 7 dias',
    ],
    notIncluded: [
      'API access',
      'Suporte priority',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: 297,
    credits: 200,
    description: 'Para profissionais',
    features: [
      '200 créditos',
      '+ DALL-E, Flux',
      'Resolução: até 1080p',
      '50 templates',
      'Sem watermark',
      'Histórico: 30 dias',
    ],
    notIncluded: [
      'API access',
    ],
    featured: true,
  },
  {
    name: 'Business',
    price: 597,
    credits: 500,
    description: 'Para equipes',
    features: [
      '500 créditos',
      'Todos os modelos',
      'Resolução: 4K',
      'Templates ilimitados',
      'Sem watermark',
      'Histórico: 90 dias',
      'API access',
    ],
    notIncluded: [],
    featured: false,
  },
  {
    name: 'Enterprise',
    price: 1797,
    credits: 2000,
    description: 'Para empresas',
    features: [
      '2000 créditos',
      'Todos os modelos',
      'Resolução: 4K',
      'Templates ilimitados',
      'Sem watermark',
      'Histórico: forever',
      'API access',
      'Suporte dedicado',
      'White-label',
    ],
    notIncluded: [],
    featured: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSelectPlan = async (planName: string, price: number) => {
    setLoading(planName)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Faça login para assinar um plano')
        router.push('/login')
        return
      }

      // In a real app, this would redirect to a payment processor
      // For now, we'll just show a success message and redirect
      toast.success(`Plano ${planName} selecionado! Em breve você será redirecionado para o pagamento.`)
      
      // Simulate payment flow
      setTimeout(() => {
        toast.info('Sistema de pagamento em desenvolvimento. Entre em contato para mais informações.')
      }, 2000)
      
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    } finally {
      setTimeout(() => setLoading(null), 3000)
    }
  }

  const handleStartFree = async () => {
    setLoading('start')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/register')
        return
      }

      toast.success('Você já tem acesso gratuito com 50 créditos!')
      router.push('/projects/new')
    } catch (error) {
      toast.error('Erro ao processar solicitação')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Planos e Créditos</h1>
        <p className="text-muted-foreground">
          Escolha o plano ideal para suas necessidades. 
          Créditos nunca expiram enquanto sua assinatura estiver ativa.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`relative ${
              plan.featured 
                ? 'border-2 border-primary shadow-lg shadow-primary/10' 
                : 'border'
            }`}
          >
            {plan.featured && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Mais Popular
              </Badge>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ {plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{plan.credits} créditos</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.featured ? 'bg-gradient-to-r from-primary to-primary/80 hover:opacity-90' : ''}`}
                variant={plan.featured ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan.name, plan.price)}
                disabled={loading !== null}
              >
                {loading === plan.name ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : plan.name === 'Start' ? (
                  'Começar Grátis'
                ) : (
                  'Assinar'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto py-12 border-t">
        <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Como funciona os créditos?</h3>
            <p className="text-sm text-muted-foreground">
              Cada operação consome créditos: 1 imagem = 1 crédito, 1 vídeo = 3 créditos. 
              Seus créditos são reabastecidos a cada mês de acordo com seu plano.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Posso comprar créditos avulsos?</h3>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode comprar packs avulsos a qualquer momento. 
              Basta acessar a seção de créditos no seu dashboard.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">O que acontece se eu cancelar?</h3>
            <p className="text-sm text-muted-foreground">
              Você mantém acesso até o final do período contratado. 
              Seus créditos não são resetados, mas não serão reabastecidos.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Posso mudar de plano?</h3>
            <p className="text-sm text-muted-foreground">
              Sim! Você pode fazer upgrade ou downgrade a qualquer momento. 
              Ao fazer upgrade, você recebe a diferença de créditos imediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
