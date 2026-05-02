export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/60 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-semibold text-xl">CREAVO</span>
          </div>
        </div>
        
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">
            Crie criativos que convertem
          </h1>
          <p className="text-white/80 text-lg">
            Vídeos e imagens UGC para anúncios em segundos. 
            Sem conhecimento técnico. Resultados profissionais.
          </p>
        </div>

        <div className="flex items-center gap-4 text-white/60 text-sm">
          <span>50 créditos grátis</span>
          <span>•</span>
          <span>Sem cartão de crédito</span>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}
