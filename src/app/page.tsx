import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Image, Video, CreditCard, Shield, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-lg">CREAVO</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Zap className="w-3 h-3 mr-1 text-primary" />
            Novo: Geração de vídeo UGC em 30 segundos
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
            De uma imagem a um criativo
            <br />
            <span className="gradient-text">que converte</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Crie vídeos e imagens UGC para anúncios em segundos. 
            Sem conhecimento técnico. Resultados profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                Criar Conta Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
            50 créditos grátis para começar • Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para criar criativos
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ferramentas poderosas em uma interface simples. 
              Arraste, solte, gere — assim de fácil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Image className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Canvas Drag & Drop</h3>
                <p className="text-muted-foreground text-sm">
                  Interface intuitiva para criar e editar criativos sem conhecimento técnico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Vídeo UGC</h3>
                <p className="text-muted-foreground text-sm">
                  Uma imagem de referência vira um vídeo de alta conversão para seus anúncios.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Geração Instantânea</h3>
                <p className="text-muted-foreground text-sm">
                  Resultados em segundos, não em horas. Escale sua produção de conteúdo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Créditos Flexíveis</h3>
                <p className="text-muted-foreground text-sm">
                  Compre apenas o que precisar. Sem mensalidade fixa.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sem Watermark</h3>
                <p className="text-muted-foreground text-sm">
                  Criativos limpos, prontos para usar em qualquer plataforma.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Templates Prontos</h3>
                <p className="text-muted-foreground text-sm">
                  Comece rápido com templates otimizados para conversão.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comece grátis e escale conforme sua necessidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Start */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg mb-1">Start</h3>
                  <div className="text-4xl font-bold mb-1">R$ 97</div>
                  <p className="text-sm text-muted-foreground">50 créditos</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    50 créditos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Modelos: Kling, Gemini
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Resolução: até 720p
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    </div>
                    Histórico: 7 dias
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Começar
                </Button>
              </CardContent>
            </Card>

            {/* Pro - Featured */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Mais Popular</Badge>
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg mb-1">Pro</h3>
                  <div className="text-4xl font-bold mb-1">R$ 297</div>
                  <p className="text-sm text-muted-foreground">200 créditos</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    200 créditos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    + DALL-E, Flux
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Resolução: até 1080p
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Sem watermark
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Histórico: 30 dias
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                  Assinar Pro
                </Button>
              </CardContent>
            </Card>

            {/* Business */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg mb-1">Business</h3>
                  <div className="text-4xl font-bold mb-1">R$ 597</div>
                  <p className="text-sm text-muted-foreground">500 créditos</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    500 créditos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Todos os modelos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Resolução: 4K
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Templates ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    Histórico: 90 dias
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Assinar Business
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/60 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para criar criativos que convertem?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Junte-se a centenas de profissionais que já estão criando 
            criativos de alta conversão com a CREAVO.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-lg">CREAVO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 CREAVO. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
