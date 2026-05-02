import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderOpen, Search, Filter, Grid, List } from 'lucide-react'

export default async function ProjectsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user?.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos de criativos
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="bg-primary/10 text-primary">
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
                <CardContent className="p-3">
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
                  <div className="flex items-center justify-between mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        project.status === 'done' ? 'bg-green-500/10 text-green-500' :
                        project.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {project.status === 'done' ? 'Concluído' :
                       project.status === 'processing' ? 'Processando' :
                       'Rascunho'}
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
          <CardContent className="py-16 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Você ainda não criou nenhum projeto. Comece criando seu primeiro projeto de criativo UGC.
            </p>
            <Link href="/projects/new">
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
