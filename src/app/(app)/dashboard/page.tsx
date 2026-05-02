import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderOpen, Image, Video, ArrowRight, Zap, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get recent projects
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })
    .limit(6)

  // Get stats
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  const { count: totalGenerations } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  const { count: imageGenerations } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .eq('type', 'image')

  const { count: videoGenerations } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .eq('type', 'video')

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', user?.id)
    .single()

  const credits = profile?.credits_balance ?? 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Vamos criar algo incrível hoje.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Credits Alert */}
      {credits < 10 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-orange-800">Créditos baixos</p>
              <p className="text-sm text-orange-600">
                Você tem apenas {credits} créditos. Considere comprar mais.
              </p>
            </div>
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                Comprar
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProjects ?? 0}</p>
                <p className="text-xs text-muted-foreground">Projetos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{imageGenerations ?? 0}</p>
                <p className="text-xs text-muted-foreground">Imagens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{videoGenerations ?? 0}</p>
                <p className="text-xs text-muted-foreground">Vídeos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{credits}</p>
                <p className="text-xs text-muted-foreground">Créditos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/projects/new?type=video">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Video className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Criar Vídeo UGC</h3>
                <p className="text-sm text-muted-foreground">De imagem a vídeo em 30s</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/projects/new?type=image">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Image className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Gerar Imagem</h3>
                <p className="text-sm text-muted-foreground">Texto para imagem com IA</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/templates">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Usar Template</h3>
                <p className="text-sm text-muted-foreground">Comece com um template</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Projetos Recentes</h2>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {recentProjects && recentProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {project.thumbnail_url ? (
                        <img 
                          src={project.thumbnail_url} 
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FolderOpen className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-medium truncate">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          project.status === 'done' ? 'bg-green-500/10 text-green-500' :
                          project.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {project.status === 'done' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluído
                          </>
                        ) : project.status === 'processing' ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Processando
                          </>
                        ) : (
                          'Rascunho'
                        )}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.updated_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Nenhum projeto ainda</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crie seu primeiro projeto e comece a criar criativos incríveis.
              </p>
              <Link href="/projects/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Projeto
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
