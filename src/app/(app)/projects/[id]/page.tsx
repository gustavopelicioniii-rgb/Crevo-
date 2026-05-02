'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Play, Save, Copy, MoreHorizontal, Settings, Trash2, Download, Eye } from 'lucide-react'
import { toast } from 'sonner'
import CanvasEditor from '@/components/canvas/canvas-editor'

export default function ProjectEditPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [canvasData, setCanvasData] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      
      if (data) {
        setProject(data)
        setCanvasData(data.canvas_data)
      }
      setLoading(false)
    }

    fetchProject()
  }, [projectId])

  const handleSave = useCallback(async (data: any) => {
    setSaving(true)
    const { error } = await supabase
      .from('projects')
      .update({ 
        canvas_data: data,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    if (error) {
      toast.error('Erro ao salvar projeto')
    } else {
      toast.success('Projeto salvo!')
      setCanvasData(data)
    }
    setSaving(false)
  }, [projectId, supabase])

  const handleGenerate = async () => {
    if (!canvasData || canvasData.elements?.length === 0) {
      toast.error('Adicione elementos ao canvas primeiro')
      return
    }

    setGenerating(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Faça login para gerar')
        router.push('/login')
        return
      }

      // Check credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', user.id)
        .single()

      const creditsNeeded = project.type === 'video' ? 3 : 1
      
      const currentCredits = profile?.credits_balance ?? 0
      
      if (currentCredits < creditsNeeded) {
        toast.error(`Créditos insuficientes. Você precisa de ${creditsNeeded} créditos.`)
        router.push('/pricing')
        return
      }

      // Update project status to processing
      await supabase
        .from('projects')
        .update({ status: 'processing' })
        .eq('id', projectId)

      // Create generation record
      const { data: generation, error: genError } = await supabase
        .from('generations')
        .insert({
          user_id: user.id,
          project_id: projectId,
          type: project.type,
          provider: 'kling',
          prompt: 'Canvas export',
          status: 'processing',
          credits_cost: creditsNeeded,
        })
        .select()
        .single()

      if (genError) {
        toast.error('Erro ao iniciar geração')
        setGenerating(false)
        return
      }

      // Deduct credits
      await supabase
        .from('profiles')
        .update({ 
          credits_balance: currentCredits - creditsNeeded 
        })
        .eq('id', user.id)

      toast.success('Geração iniciada! Você será notificado quando estiver pronta.')
      
      // Simulate generation completion (in real app, this would be handled by webhooks)
      setTimeout(async () => {
        await supabase
          .from('generations')
          .update({ 
            status: 'done',
            output_url: 'https://example.com/output.mp4'
          })
          .eq('id', generation.id)

        await supabase
          .from('projects')
          .update({ status: 'done' })
          .eq('id', projectId)

        toast.success('Seu criativo está pronto!')
        setGenerating(false)
        router.refresh()
      }, 3000)

    } catch (error) {
      toast.error('Erro ao processar geração')
      setGenerating(false)
    }
  }

  const handleDuplicate = async () => {
    if (!project) return

    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user?.id,
        name: `${project.name} (cópia)`,
        type: project.type,
        canvas_data: project.canvas_data,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao duplicar projeto')
    } else {
      toast.success('Projeto duplicado!')
      router.push(`/projects/${data.id}`)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      toast.error('Erro ao excluir projeto')
    } else {
      toast.success('Projeto excluído!')
      router.push('/projects')
    }
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
        <Link href="/projects">
          <Button>Voltar para Projetos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="h-14 border-b bg-background px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-medium">{project.name}</h1>
            <Badge variant="secondary" className="text-xs">
              {project.type === 'video' ? 'Vídeo UGC' : 'Imagem'} • {project.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={saving} onClick={() => handleSave(canvasData)}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Gerar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas Editor */}
      <div className="flex-1 overflow-hidden">
        <CanvasEditor
          projectId={projectId}
          initialData={project.canvas_data}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
