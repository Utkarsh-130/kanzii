import Account from '@/components/Accounts'
import Auth from '@/components/Auth'
import { supabase } from '@/components/utils/supabase'
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}