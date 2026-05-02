import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, Star, Lock, Play } from 'lucide-react'

export default async function TemplatesPage() {
  const supabase = await createClient()
  
  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .order('usage_count', { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Escolha um template para começar rapidamente
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="cursor-pointer bg-primary/10 text-primary border-0">
          Todos
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          UGC
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          E-commerce
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Infoprodutos
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Serviços
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          SaaS
        </Badge>
      </div>

      {/* Templates Grid */}
      {templates && templates.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative flex items-center justify-center">
                {template.thumbnail_url ? (
                  <img 
                    src={template.thumbnail_url} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl opacity-50">🎬</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" className="bg-white/90 hover:bg-white text-black">
                    <Play className="w-5 h-5" />
                  </Button>
                </div>
                {template.is_premium && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{template.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" />
                    {template.usage_count}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-medium mb-2">Templates em breve</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Estamos preparando templates incríveis para você. Em breve estarándisponíveis!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
