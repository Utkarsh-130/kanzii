import { supabase } from '@/components/utils/supabase'
import React, { useState } from 'react'
import { Alert, AppState, StyleSheet, View } from 'react-native'
import { Button, TextInput, Surface } from 'react-native-paper'
import { ThemedText } from '@/components/ThemedText'
import { theme } from '@/components/theme'
import Animated, { FadeInDown } from 'react-native-reanimated'

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)}>
        <ThemedText type="heading" style={styles.title}>
          Welcome!
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Sign in to save your progress and access all features
        </ThemedText>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(200)}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="Password"
            mode="outlined"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(300)} style={styles.buttonContainer}>
        <Button 
          mode="contained"
          disabled={loading}
          onPress={() => signInWithEmail()}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          loading={loading}
        >
          Sign In
        </Button>
        
        <Button 
          mode="outlined"
          disabled={loading}
          onPress={() => signUpWithEmail()}
          style={styles.secondaryButton}
          contentStyle={styles.buttonContent}
        >
          Create Account
        </Button>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    elevation: 2,
  },
  secondaryButton: {
    borderRadius: 12,
    borderColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
})
