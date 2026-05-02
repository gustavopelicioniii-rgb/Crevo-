'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Play, Save, Copy, MoreHorizontal, Settings, Trash2 } from 'lucide-react'
import CanvasEditor from '@/components/canvas/canvas-editor'

export default function ProjectEditPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      }
      setLoading(false)
    }

    fetchProject()
  }, [projectId])

  const handleSave = async (canvasData: any) => {
    setSaving(true)
    const { error } = await supabase
      .from('projects')
      .update({ 
        canvas_data: canvasData,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)

    setSaving(false)
    if (!error) {
      // Success toast would be shown by canvas editor
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
          <Button variant="outline" size="sm" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
            <Play className="w-4 h-4 mr-2" />
            Gerar
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
