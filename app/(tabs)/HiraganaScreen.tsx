import CardDisplay from '@/components/Charactercards'
import { ThemedText } from '@/components/ThemedText'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
// @ts-ignore
import hiraganaData from '@/assets/dataset/hiragana.json'

const renderHiraganaItem = (key: string, details: any) => (
  <>
    <ThemedText>{key}</ThemedText>
    <ThemedText>{details.romaji}</ThemedText>
   
  </>
)

export default function HiraganaScreen() {
  return (
    <SafeAreaView>
      <CardDisplay 
        data={hiraganaData} 
        renderItem={renderHiraganaItem} 
      /> 
    </SafeAreaView>
  )
}