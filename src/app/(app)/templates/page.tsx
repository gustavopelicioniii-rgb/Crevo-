'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, Star, Lock, Play, Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const router = useRouter()
  
  // Mock templates - in a real app these would come from the database
  const templates = [
    { id: '1', name: 'Talking Head', category: 'ugc', usage_count: 234, is_premium: false, thumbnail_url: null },
    { id: '2', name: 'Product Showcase', category: 'ugc', usage_count: 189, is_premium: false, thumbnail_url: null },
    { id: '3', name: 'Before/After', category: 'ugc', usage_count: 156, is_premium: false, thumbnail_url: null },
    { id: '4', name: 'Testimonial', category: 'ugc', usage_count: 143, is_premium: false, thumbnail_url: null },
    { id: '5', name: 'Tutorial', category: 'ugc', usage_count: 98, is_premium: false, thumbnail_url: null },
    { id: '6', name: 'E-commerce Spotlight', category: 'e-commerce', usage_count: 87, is_premium: true, thumbnail_url: null },
    { id: '7', name: 'Product Rotation', category: 'e-commerce', usage_count: 76, is_premium: true, thumbnail_url: null },
    { id: '8', name: 'Course Promo', category: 'infoprodutos', usage_count: 65, is_premium: true, thumbnail_url: null },
    { id: '9', name: 'Landing Page Hero', category: 'saas', usage_count: 54, is_premium: true, thumbnail_url: null },
    { id: '10', name: 'Service Demo', category: 'servicos', usage_count: 43, is_premium: false, thumbnail_url: null },
  ]

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'ugc', name: 'UGC' },
    { id: 'e-commerce', name: 'E-commerce' },
    { id: 'infoprodutos', name: 'Infoprodutos' },
    { id: 'servicos', name: 'Serviços' },
    { id: 'saas', name: 'SaaS' },
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (templateId: string, isPremium: boolean) => {
    if (isPremium) {
      toast.error('Este template é exclusivo para planos Pro ou superiores')
      router.push('/pricing')
      return
    }

    // Redirect to create new project with this template
    router.push(`/projects/new?template=${templateId}`)
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Badge 
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'secondary'}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category.id 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-primary/20'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative flex items-center justify-center">
                <div className="text-4xl opacity-50">
                  {template.category === 'ugc' ? '🎬' : 
                   template.category === 'e-commerce' ? '🛒' : 
                   template.category === 'infoprodutos' ? '📚' :
                   template.category === 'saas' ? '💻' : '🛠️'}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    className="bg-white/90 hover:bg-white text-black"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template.id, template.is_premium)
                    }}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template.id, template.is_premium)
                    }}
                  >
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
                  <Badge variant="secondary" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" />
                    {template.usage_count}
                  </div>
                </div>
                <Button 
                  className="w-full mt-3" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUseTemplate(template.id, template.is_premium)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">Nenhum template encontrado</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Tente buscar com outros termos ou escolha uma categoria diferente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
