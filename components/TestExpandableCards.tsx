import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/components/theme';
import CardDisplay from './Charactercards';
// @ts-ignore
import kanjiData from '@/assets/dataset/dictionaryn5.json';

const TestExpandableCards: React.FC = () => {
  const renderKanjiItem = (kanji: string, details: any) => {
    return (
      <View style={styles.kanjiItemContainer}>
        <Text style={styles.kanjiCharacter}>{kanji}</Text>
      </View>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceVariant]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Test Expandable Cards
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Tap any kanji to see the expansion animation
            </Text>
          </View>
          
          <View style={styles.cardsContainer}>
            <CardDisplay
              data={kanjiData}
              renderItem={renderKanjiItem}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </PaperProvider>
  );
};

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
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  cardsContainer: {
    flex: 1,
  },
  kanjiItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  kanjiCharacter: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
});

export default TestExpandableCards;
