import React from 'react';
import TestExpandableCards from '@/components/TestExpandableCards';

// Temporary replacement to test expandable character cards

const { width: screenWidth } = Dimensions.get('window');

interface KanjiData {
  meaning: string;
  reading: string;
  strokes: number;
  level: string;
}

const FlashCard = ({ 
  kanji, 
  data, 
  index 
}: { 
  kanji: string; 
  data: KanjiData; 
  index: number; 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useSharedValue(0);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    flipAnimation.value = withTiming(toValue, { duration: 600 });
    setIsFlipped(!isFlipped);
  };

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

  const getLevelColor = (level: string) => {
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
      <Pressable onPress={flipCard} style={styles.cardPressable}>
        {/* Front of card */}
        <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
          <Card style={styles.flashCard}>
            <LinearGradient
              colors={[getLevelColor(data.level) + '20', getLevelColor(data.level) + '10']}
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
                  <Chip 
                    style={styles.strokeChip}
                    textStyle={styles.strokeChipText}
                  >
                    {data.strokes} strokes
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

        {/* Back of card */}
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
                  
                  <View style={styles.readingContainer}>
                    <ThemedText type="default" style={styles.readingLabel}>
                      Reading:
                    </ThemedText>
                    <ThemedText type="default" style={styles.reading}>
                      {data.reading}
                    </ThemedText>
                  </View>
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
  return <TestExpandableCards />;
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
    width: (screenWidth - 60) / 2,
    marginBottom: 20,
    height: 280,
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
  strokeChip: {
    height: 28,
    backgroundColor: theme.colors.outline + '30',
  },
  strokeChipText: {
    fontSize: 11,
    color: theme.colors.onSurface,
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
});
