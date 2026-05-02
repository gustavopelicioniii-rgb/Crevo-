'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Image, Video, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const [name, setName] = useState('')
  const [type, setType] = useState<'image' | 'video'>('video')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam === 'image' || typeParam === 'video') {
      setType(typeParam)
    }
  }, [searchParams])

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Digite um nome para o projeto')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Faça login para criar um projeto')
      router.push('/login')
      return
    }

    // Check if user has credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .single()

    if (!profile || profile.credits_balance < 1) {
      toast.error('Créditos insuficientes')
      router.push('/pricing')
      return
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        type,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao criar projeto: ' + error.message)
    } else {
      toast.success('Projeto criado!')
      router.push(`/projects/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para projetos
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Criar Novo Projeto</h1>
        <p className="text-muted-foreground">
          Escolha o tipo de criativo que você quer criar
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do projeto</Label>
            <Input
              id="name"
              placeholder="Ex: Anúncio produto X"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="space-y-3">
            <Label>Tipo de criativo</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('video')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  type === 'video' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <Video className={`w-8 h-8 mb-2 ${type === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-medium">Vídeo UGC</h3>
                <p className="text-sm text-muted-foreground">3 créditos</p>
              </button>

              <button
                type="button"
                onClick={() => setType('image')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  type === 'image' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <Image className={`w-8 h-8 mb-2 ${type === 'image' ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-medium">Imagem</h3>
                <p className="text-sm text-muted-foreground">1 crédito</p>
              </button>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Projeto'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
