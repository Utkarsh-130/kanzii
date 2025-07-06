import KatakanaData from '@/assets/dataset/katakana.json'
import CardDisplay from '@/components/Charactercards'
import { ThemedText } from '@/components/ThemedText'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// @ts-ignore

const renderHiraganaItem = (key: string, details: any) => (
  <>
    <ThemedText>{key}</ThemedText>
    <ThemedText>{details.romaji}</ThemedText>
    <ThemedText>{details.line}</ThemedText>
  </>
)

export default function HiraganaScreen() {
  return (
    <SafeAreaView>
      <CardDisplay 
        data={KatakanaData} 
        renderItem={renderHiraganaItem} 
      /> 
    </SafeAreaView>
  )
}