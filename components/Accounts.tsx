import { auth, db } from '@/components/utils/firebase'
import { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (user) getProfile()
  }, [user])

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user!')

      const docRef = doc(db, 'profiles', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!user) throw new Error('No user!')

      const updates = {
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      await setDoc(doc(db, 'profiles', user.uid), updates, { merge: true })
      Alert.alert('Success', 'Profile updated!')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput label="Email" value={user?.email || ''} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button onPress={() => auth.signOut()}>Sign Out</Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})