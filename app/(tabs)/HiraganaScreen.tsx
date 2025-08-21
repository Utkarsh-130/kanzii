import CardDisplay from '@/components/Charactercards'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, View, ScrollView } from 'react-native'
import { PaperProvider, Appbar, Surface } from 'react-native-paper'
import { theme } from '@/components/theme'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
// @ts-ignore
import hiraganaData from '@/assets/dataset/hiragana.json'

const renderHiraganaItem = (key: string, details: any) => (
  <View style={styles.characterContent}>
    <ThemedText type="character" animated>
      {key}
    </ThemedText>
    <ThemedText type="romaji" animated>
      {details.romaji}
    </ThemedText>
  </View>
)

export default function HiraganaScreen() {
  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceVariant]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
            <Surface style={styles.headerSurface} elevation={2}>
              <ThemedText type="heading" style={styles.title}>
                ひらがな (Hiragana)
              </ThemedText>
              <ThemedText type="default" style={styles.subtitle}>
                Learn the basic Japanese phonetic characters
              </ThemedText>
            </Surface>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(200)} style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <CardDisplay 
                data={hiraganaData} 
                renderItem={renderHiraganaItem} 
              />
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerSurface: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.surface + '95',
    backdropFilter: 'blur(10px)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  characterContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
