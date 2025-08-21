import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider, Card, Surface, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/components/theme';
import { ThemedText } from '@/components/ThemedText';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AnimatedFeature = ({ children, delay = 0 }: any) => {
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.02, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View 
      entering={FadeInLeft.delay(delay)}
      style={animatedStyle}
    >
      {children}
    </Animated.View>
  );
};

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  delay = 0 
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  delay?: number;
}) => (
  <AnimatedFeature delay={delay}>
    <Card style={styles.featureCard}>
      <LinearGradient
        colors={[color + '20', color + '10']}
        style={styles.cardGradient}
      >
        <Card.Content style={styles.featureContent}>
          <View style={styles.featureHeader}>
            <Surface style={[styles.iconContainer, { backgroundColor: color + '30' }]}>
              <ThemedText type="character" style={[styles.featureIcon, { color }]}>
                {icon}
              </ThemedText>
            </Surface>
            <ThemedText type="subtitle" style={styles.featureTitle}>
              {title}
            </ThemedText>
          </View>
          <ThemedText type="default" style={styles.featureDescription}>
            {description}
          </ThemedText>
        </Card.Content>
      </LinearGradient>
    </Card>
  </AnimatedFeature>
);

const StatCard = ({ number, label, delay = 0 }: any) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.statCard}>
    <Surface style={styles.statSurface} elevation={4}>
      <ThemedText type="heading" style={styles.statNumber}>
        {number}
      </ThemedText>
      <ThemedText type="default" style={styles.statLabel}>
        {label}
      </ThemedText>
    </Surface>
  </Animated.View>
);

export default function ExploreScreen() {
  return (
    <PaperProvider theme={theme}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surfaceVariant]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
              <Surface style={styles.headerSurface} elevation={2}>
                <ThemedText type="title" style={styles.headerTitle}>
                  Discover Japanese
                </ThemedText>
                <ThemedText type="default" style={styles.headerSubtitle}>
                  Explore the beauty and complexity of Japanese writing systems
                </ThemedText>
              </Surface>
            </Animated.View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <StatCard number="46" label="Hiragana" delay={200} />
              <StatCard number="46" label="Katakana" delay={300} />
              <StatCard number="2000+" label="Kanji" delay={400} />
            </View>

            {/* Features Section */}
            <View style={styles.featuresContainer}>
              <FeatureCard
                title="Hiragana Mastery"
                description="Master the foundational script of Japanese with our interactive learning system. Perfect for beginners starting their Japanese journey."
                icon="あ"
                color={theme.colors.primary}
                delay={500}
              />
              
              <FeatureCard
                title="Katakana Excellence"
                description="Learn the angular script used for foreign words and emphasis. Essential for reading modern Japanese texts and media."
                icon="ア"
                color={theme.colors.secondary}
                delay={600}
              />
              
              <FeatureCard
                title="Interactive Learning"
                description="Engage with beautiful animations and smooth transitions that make learning Japanese characters enjoyable and memorable."
                icon="✨"
                color={theme.colors.accent}
                delay={700}
              />
              
              <FeatureCard
                title="Progress Tracking"
                description="Monitor your learning progress with detailed analytics and personalized recommendations to accelerate your mastery."
                icon="📊"
                color={theme.colors.accentSecondary}
                delay={800}
              />
            </View>

            {/* Learning Tips */}
            <Animated.View entering={FadeInUp.delay(900)} style={styles.tipsSection}>
              <Surface style={styles.tipsSurface} elevation={3}>
                <ThemedText type="heading" style={styles.tipsTitle}>
                  Learning Tips
                </ThemedText>
                
                <View style={styles.tipsList}>
                  <View style={styles.tipItem}>
                    <Chip style={styles.tipChip} textStyle={styles.tipChipText}>1</Chip>
                    <ThemedText type="default" style={styles.tipText}>
                      Practice daily for 15-20 minutes for best results
                    </ThemedText>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Chip style={styles.tipChip} textStyle={styles.tipChipText}>2</Chip>
                    <ThemedText type="default" style={styles.tipText}>
                      Focus on stroke order to build muscle memory
                    </ThemedText>
                  </View>
                  
                  <View style={styles.tipItem}>
                    <Chip style={styles.tipChip} textStyle={styles.tipChipText}>3</Chip>
                    <ThemedText type="default" style={styles.tipText}>
                      Use mnemonics to remember character shapes and sounds
                    </ThemedText>
                  </View>
                </View>
              </Surface>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    paddingVertical: 30,
  },
  headerSurface: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: theme.colors.surface + '95',
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  headerSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statSurface: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  statNumber: {
    color: theme.colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    opacity: 0.8,
    fontSize: 12,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
  },
  featureContent: {
    padding: 20,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    flex: 1,
  },
  featureDescription: {
    lineHeight: 22,
    opacity: 0.9,
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsSurface: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  },
  tipsTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.secondary,
  },
  tipsList: {
    gap: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipChip: {
    marginRight: 15,
    backgroundColor: theme.colors.primary + '20',
  },
  tipChipText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  tipText: {
    flex: 1,
    lineHeight: 20,
  },
});
