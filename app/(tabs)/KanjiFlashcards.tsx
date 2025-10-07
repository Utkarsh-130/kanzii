import { ThemedText } from '@/components/ThemedText';
import { theme } from '@/components/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import Animated, {
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Temporary replacement to test expandable character cards

const { width: screenWidth } = Dimensions.get('window');

interface KanjiData {
  meaning: string;
  onyomi?: string;
  kunyomi?: string;
  usage?: string;
  level?: string;
}

const FlashCard = ({ 
  kanji, 
  data, 
  index,
  showAnswer,
  onFlip 
}: { 
  kanji: string; 
  data: KanjiData; 
  index: number;
  showAnswer: boolean;
  onFlip: () => void;
}) => {
  const flipAnimation = useSharedValue(showAnswer ? 1 : 0);

  // Update animation when showAnswer changes
  useEffect(() => {
    flipAnimation.value = withTiming(showAnswer ? 1 : 0, { duration: 600 });
  }, [showAnswer]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(flipAnimation.value, [0, 0.5, 1], [1, 0, 0]),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(flipAnimation.value, [0, 0.5, 1], [0, 0, 1]),
    };
  });

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'basic':
        return theme.colors.primary;
      case 'intermediate':
        return theme.colors.secondary;
      case 'advanced':
        return theme.colors.accent;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100)} 
      style={styles.flashCardContainer}
    >
      <Pressable onPress={onFlip} style={styles.cardPressable}>
        {/* Front of card */}
        <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
          <Card style={styles.flashCard}>
            <LinearGradient
              colors={[getLevelColor(data.level || 'basic') + '20', getLevelColor(data.level || 'basic') + '10']}
              style={styles.cardGradient}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Chip 
                    style={[styles.levelChip, { backgroundColor: getLevelColor(data.level) + '30' }]}
                    textStyle={[styles.levelChipText, { color: getLevelColor(data.level) }]}
                  >
                    {data.level}
                  </Chip>
                </View>
                
                <View style={styles.kanjiContainer}>
                  <ThemedText type="character" style={styles.kanjiCharacter}>
                    {kanji}
                  </ThemedText>
                  <ThemedText type="default" style={styles.debugText}>
                    DEBUG: {kanji} ({data.level})
                  </ThemedText>
                </View>
                
                <ThemedText type="default" style={styles.tapHint}>
                  Tap to reveal meaning
                </ThemedText>
              </Card.Content>
            </LinearGradient>
          </Card>
        </Animated.View>

    
        <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
          <Card style={styles.flashCard}>
            <LinearGradient
              colors={[getLevelColor(data.level) + '30', getLevelColor(data.level) + '15']}
              style={styles.cardGradient}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <ThemedText type="character" style={[styles.smallKanji, { color: getLevelColor(data.level) }]}>
                    {kanji}
                  </ThemedText>
                </View>
                
                <View style={styles.meaningContainer}>
                  <ThemedText type="subtitle" style={styles.meaning}>
                    {data.meaning}
                  </ThemedText>
                  
                  {data.onyomi && (
                    <View style={styles.readingContainer}>
                      <ThemedText type="default" style={styles.readingLabel}>
                        Onyomi:
                      </ThemedText>
                      <ThemedText type="default" style={styles.reading}>
                        {data.onyomi}
                      </ThemedText>
                    </View>
                  )}
                  
                  {data.kunyomi && (
                    <View style={styles.readingContainer}>
                      <ThemedText type="default" style={styles.readingLabel}>
                        Kunyomi:
                      </ThemedText>
                      <ThemedText type="default" style={styles.reading}>
                        {data.kunyomi}
                      </ThemedText>
                    </View>
                  )}
                  
                  {data.usage && (
                    <View style={styles.usageContainer}>
                      <ThemedText type="default" style={styles.usageLabel}>
                        Example:
                      </ThemedText>
                      <ThemedText type="default" style={styles.usage}>
                        {data.usage}
                      </ThemedText>
                    </View>
                  )}
                </View>
                
                <ThemedText type="default" style={styles.tapHint}>
                  Tap to flip back
                </ThemedText>
              </Card.Content>
            </LinearGradient>
          </Card>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function KanjiFlashcards() {
  const [kanjiData, setKanjiData] = useState<Record<string, any>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load kanji data
  useEffect(() => {
    try {
      const data = require('@/assets/dataset/dictionaryn5.json');
      setKanjiData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load kanji data:', error);
      setLoading(false);
    }
  }, []);

  const kanjiEntries = Object.entries(kanjiData);
  const currentKanji = kanjiEntries[currentIndex];

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    console.log(`Rated ${currentKanji?.[0]} as ${rating}`);
    
    // Move to next card
    setCurrentIndex((prev) => (prev + 1) % kanjiEntries.length);
    setShowAnswer(false);
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading kanji...</ThemedText>
        </View>
      </View>
    );
  }

  if (!currentKanji) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>No kanji data available</ThemedText>
        </View>
      </View>
    );
  }

  const [kanji, data] = currentKanji;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface + '50']}
        style={styles.gradient}
      >
        <View style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerSurface}>
              <ThemedText type="heading" style={styles.title}>
                Kanji Flashcards
              </ThemedText>
              <ThemedText type="default" style={styles.subtitle}>
                Card {currentIndex + 1} of {kanjiEntries.length}
              </ThemedText>
            </View>
          </View>

          {/* Card Container */}
          <View style={styles.cardContainer}>
            <FlashCard 
              kanji={kanji}
              data={data}
              index={currentIndex}
              showAnswer={showAnswer}
              onFlip={flipCard}
            />
          </View>

          {/* Rating Buttons */}
          {showAnswer && (
            <Animated.View 
              entering={FadeInUp.delay(300)}
              style={styles.ratingContainer}
            >
              <ThemedText type="default" style={styles.ratingTitle}>
                How well did you know this?
              </ThemedText>
              <View style={styles.ratingButtons}>
                <Pressable 
                  style={[styles.ratingButton, styles.againButton]}
                  onPress={() => handleRating('again')}
                >
                  <ThemedText style={styles.ratingButtonText}>Again</ThemedText>
                  <ThemedText style={styles.ratingSubtext}>&lt;1m</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.ratingButton, styles.hardButton]}
                  onPress={() => handleRating('hard')}
                >
                  <ThemedText style={styles.ratingButtonText}>Hard</ThemedText>
                  <ThemedText style={styles.ratingSubtext}>6m</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.ratingButton, styles.goodButton]}
                  onPress={() => handleRating('good')}
                >
                  <ThemedText style={styles.ratingButtonText}>Good</ThemedText>
                  <ThemedText style={styles.ratingSubtext}>1d</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.ratingButton, styles.easyButton]}
                  onPress={() => handleRating('easy')}
                >
                  <ThemedText style={styles.ratingButtonText}>Easy</ThemedText>
                  <ThemedText style={styles.ratingSubtext}>4d</ThemedText>
                </Pressable>
              </View>
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
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
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.accent,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterChip: {
    marginRight: 10,
    backgroundColor: theme.colors.surface,
  },
  selectedFilterChip: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    color: theme.colors.onSurface,
  },
  selectedFilterChipText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  flashCardContainer: {
    width: screenWidth - 40,
    marginBottom: 20,
    height: 400,
  },
  cardPressable: {
    flex: 1,
  },
  cardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  flashCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 8,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelChip: {
    height: 28,
  },
  levelChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  kanjiContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kanjiCharacter: {
    fontSize: 48,
    textAlign: 'center',
    fontWeight: '400',
    includeFontPadding: false,
    lineHeight: 60,
  },
  smallKanji: {
    fontSize: 32,
    fontWeight: '600',
  },
  meaningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meaning: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
    fontWeight: '600',
  },
  readingContainer: {
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  reading: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  debugText: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 5,
  },
  gradient: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Rating Components
  ratingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ratingTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  againButton: {
    backgroundColor: '#ef4444',
  },
  hardButton: {
    backgroundColor: '#f97316',
  },
  goodButton: {
    backgroundColor: '#22c55e',
  },
  easyButton: {
    backgroundColor: '#3b82f6',
  },
  ratingButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  ratingSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
});
