import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/app-shell'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user credits
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', user.id)
    .single()

  return (
    <AppShell credits={profile?.credits_balance ?? 0}>
      {children}
    </AppShell>
  )
}
