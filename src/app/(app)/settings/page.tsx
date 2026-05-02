'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { User, CreditCard, Bell, Shield, Key, Loader2, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('start')
  const [credits, setCredits] = useState(0)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    marketing: false,
    generation: true,
    credits: true,
  })
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setName(user.user_metadata?.name || '')
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setPlan(profile.plan || 'start')
          setCredits(profile.credits_balance || 0)
        }
      }
    }
    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        toast.error('Erro ao salvar perfil')
      } else {
        await supabase.auth.updateUser({ data: { name } })
        toast.success('Perfil atualizado com sucesso!')
      }
    }
    setLoading(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    if (newPassword.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      toast.error('Erro ao alterar senha: ' + error.message)
    } else {
      toast.success('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Preferência atualizada')
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações e preferências
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Faturamento</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Plano atual</p>
                    <p className="text-2xl font-bold capitalize">{plan}</p>
                  </div>
                  <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                    Mudar Plano
                  </Button>
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Faturamento</CardTitle>
              <CardDescription>
                Gerencie seu plano e pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plano atual</p>
                    <p className="text-2xl font-bold capitalize">{plan}</p>
                  </div>
                  <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                    Mudar Plano
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Créditos disponíveis</p>
                    <p className="text-2xl font-bold">{credits}</p>
                  </div>
                  <Button onClick={() => window.location.href = '/pricing'}>
                    Comprar mais
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Histórico de pagamentos</Label>
                <div className="border rounded-lg divide-y">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pack Start</p>
                      <p className="text-sm text-muted-foreground">01/05/2026</p>
                    </div>
                    <span className="font-medium">R$ 97,00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como você recebe alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email de marketing</p>
                  <p className="text-sm text-muted-foreground">
                    Novidades e promoções
                  </p>
                </div>
                <Button 
                  variant={notifications.marketing ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleNotificationToggle('marketing')}
                >
                  {notifications.marketing ? 'Ativado' : 'Ativar'}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Geração concluída</p>
                  <p className="text-sm text-muted-foreground">
                    Quando seu criativo estiver pronto
                  </p>
                </div>
                <Button 
                  variant={notifications.generation ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleNotificationToggle('generation')}
                >
                  {notifications.generation ? 'Ativado' : 'Ativar'}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Créditos baixos</p>
                  <p className="text-sm text-muted-foreground">
                    Quando seus créditos estiverem acabando
                  </p>
                </div>
                <Button 
                  variant={notifications.credits ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleNotificationToggle('credits')}
                >
                  {notifications.credits ? 'Ativado' : 'Ativar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Proteja sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Alterar senha</p>
                      <p className="text-sm text-muted-foreground">
                        Use uma senha forte e única
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Alterar Senha
                  </Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Autenticação em dois fatores</p>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Em breve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
