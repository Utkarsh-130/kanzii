import Account from '@/components/Accounts'
import Auth from '@/components/Auth'
import { supabase } from '@/components/utils/supabase'
import { Session } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PaperProvider, Card, Surface, Button, Text, IconButton, Avatar } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '@/components/theme'
import { ThemedText } from '@/components/ThemedText'
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { router } from 'expo-router'

const { width, height } = Dimensions.get('window');

const FloatingCard = ({ children, delay = 0, style }: any) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(10, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View 
      entering={FadeInUp.delay(delay)} 
      style={[animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
};

const WelcomeSection = () => (
  <View style={styles.welcomeSection}>
    <Animated.View entering={FadeInDown.delay(100)}>
      <ThemedText type="title" style={styles.welcomeTitle}>
        Welcome to Kanzii
      </ThemedText>
    </Animated.View>
    
    <Animated.View entering={FadeInDown.delay(200)}>
      <ThemedText type="subtitle" style={styles.welcomeSubtitle}>
        Your Journey to Master Japanese Writing
      </ThemedText>
    </Animated.View>

    <Animated.View entering={FadeInDown.delay(300)}>
      <ThemedText type="default" style={styles.welcomeDescription}>
        Start learning Japanese characters with our interactive and beautiful interface. 
        Master Hiragana and Katakana with engaging practice sessions.
      </ThemedText>
    </Animated.View>
  </View>
);

const LearningCards = () => (
  <View style={styles.cardsContainer}>
    <FloatingCard delay={400} style={styles.cardWrapper}>
      <Card style={styles.learningCard} onPress={() => router.push('/HiraganaScreen')}>
        <LinearGradient
          colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
          style={styles.cardGradient}
        >
          <Card.Content style={styles.cardContent}>
            <ThemedText type="character" style={styles.cardCharacter}>
              あ
            </ThemedText>
            <ThemedText type="heading" style={styles.cardTitle}>
              Hiragana
            </ThemedText>
            <ThemedText type="default" style={styles.cardDescription}>
              Learn the basic Japanese phonetic script
            </ThemedText>
            <Button 
              mode="contained" 
              style={styles.cardButton}
              contentStyle={styles.buttonContent}
            >
              Start Learning
            </Button>
          </Card.Content>
        </LinearGradient>
      </Card>
    </FloatingCard>

    <FloatingCard delay={500} style={styles.cardWrapper}>
      <Card style={styles.learningCard} onPress={() => router.push('/Katakana')}>
        <LinearGradient
          colors={[theme.colors.secondary + '20', theme.colors.secondary + '10']}
          style={styles.cardGradient}
        >
          <Card.Content style={styles.cardContent}>
            <ThemedText type="character" style={styles.cardCharacter}>
              ア
            </ThemedText>
            <ThemedText type="heading" style={styles.cardTitle}>
              Katakana
            </ThemedText>
            <ThemedText type="default" style={styles.cardDescription}>
              Master the angular Japanese script
            </ThemedText>
            <Button 
              mode="contained" 
              style={[styles.cardButton, { backgroundColor: theme.colors.secondary }]}
              contentStyle={styles.buttonContent}
            >
              Start Learning
            </Button>
          </Card.Content>
        </LinearGradient>
      </Card>
    </FloatingCard>

    <FloatingCard delay={600} style={styles.cardWrapper}>
      <Card style={styles.learningCard} onPress={() => router.push('/KanjiFlashcards')}>
        <LinearGradient
          colors={[theme.colors.accent + '20', theme.colors.accent + '10']}
          style={styles.cardGradient}
        >
          <Card.Content style={styles.cardContent}>
            <ThemedText type="character" style={styles.cardCharacter}>
              日
            </ThemedText>
            <ThemedText type="heading" style={styles.cardTitle}>
              Kanji
            </ThemedText>
            <ThemedText type="default" style={styles.cardDescription}>
              Learn essential Japanese characters with flashcards
            </ThemedText>
            <Button 
              mode="contained" 
              style={[styles.cardButton, { backgroundColor: theme.colors.accent }]}
              contentStyle={styles.buttonContent}
            >
              Practice Cards
            </Button>
          </Card.Content>
        </LinearGradient>
      </Card>
    </FloatingCard>
  </View>
);

const AuthenticatedWelcomeSection = ({ session }: { session: Session }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', session?.user.id)
        .single();
        
      if (error && status !== 406) {
        console.log('Profile error:', error);
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.log('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const displayName = username || session?.user?.email?.split('@')[0] || 'User';

  return (
    <View style={styles.welcomeSection}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.userHeader}>
        <Surface style={styles.userSurface} elevation={3}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={60} 
              label={displayName.charAt(0).toUpperCase()} 
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.userTextContainer}>
              <ThemedText type="heading" style={styles.welcomeBackTitle}>
                Welcome back, {displayName}!
              </ThemedText>
              <ThemedText type="default" style={styles.userEmail}>
                {session?.user?.email}
              </ThemedText>
            </View>
            <IconButton
              icon="cog"
              iconColor={theme.colors.primary}
              size={24}
              onPress={() => {
                router.push('/settings');
              }}
            />
          </View>
        </Surface>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(200)}>
        <ThemedText type="subtitle" style={styles.continueTitle}>
          Continue Your Japanese Journey
        </ThemedText>
      </Animated.View>
    </View>
  );
};

const UserProgressCard = ({ session }: { session: Session }) => (
  <Animated.View entering={FadeInUp.delay(300)} style={styles.progressSection}>
    <Surface style={styles.progressSurface} elevation={2}>
      <ThemedText type="subtitle" style={styles.progressTitle}>
        Your Progress
      </ThemedText>
      <View style={styles.progressGrid}>
        <View style={styles.progressItem}>
          <ThemedText type="heading" style={[styles.progressNumber, { color: theme.colors.primary }]}>
            0
          </ThemedText>
          <ThemedText type="default" style={styles.progressLabel}>
            Hiragana Learned
          </ThemedText>
        </View>
        <View style={styles.progressItem}>
          <ThemedText type="heading" style={[styles.progressNumber, { color: theme.colors.secondary }]}>
            0
          </ThemedText>
          <ThemedText type="default" style={styles.progressLabel}>
            Katakana Learned
          </ThemedText>
        </View>
        <View style={styles.progressItem}>
          <ThemedText type="heading" style={[styles.progressNumber, { color: theme.colors.accent }]}>
            0
          </ThemedText>
          <ThemedText type="default" style={styles.progressLabel}>
            Kanji Learned
          </ThemedText>
        </View>
      </View>
    </Surface>
  </Animated.View>
);


export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <PaperProvider theme={theme}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surfaceVariant]}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
              <Animated.View entering={FadeInUp.delay(100)} style={styles.loadingContent}>
                <Surface style={styles.loadingSurface} elevation={3}>
                  <ThemedText type="character" style={styles.loadingCharacter}>
                    漢
                  </ThemedText>
                  <ThemedText type="heading" style={styles.loadingTitle}>
                    Kanzii
                  </ThemedText>
                  <ThemedText type="default" style={styles.loadingSubtitle}>
                    Loading your Japanese learning journey...
                  </ThemedText>
                </Surface>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </PaperProvider>
    );
  }

  // If not authenticated, show only the auth screen
  if (!session || !session.user) {
    return (
      <PaperProvider theme={theme}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surfaceVariant]}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView 
              contentContainerStyle={styles.authOnlyScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* App Branding */}
              <Animated.View entering={FadeInDown.delay(100)} style={styles.brandingSection}>
                <Surface style={styles.brandingSurface} elevation={3}>
                  <ThemedText type="character" style={styles.brandingCharacter}>
                    漢字
                  </ThemedText>
                  <ThemedText type="title" style={styles.brandingTitle}>
                    Kanzii
                  </ThemedText>
                  <ThemedText type="subtitle" style={styles.brandingSubtitle}>
                    Master Japanese Writing
                  </ThemedText>
                  <ThemedText type="default" style={styles.brandingDescription}>
                    Learn Hiragana, Katakana, and Kanji with our interactive flashcards and beautiful interface.
                  </ThemedText>
                </Surface>
              </Animated.View>

              {/* Features Preview */}
              <Animated.View entering={FadeInUp.delay(200)} style={styles.featuresPreview}>
                <ThemedText type="subtitle" style={styles.featuresTitle}>
                  What You&apos;ll Learn
                </ThemedText>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <ThemedText type="character" style={styles.featureCharacter}>
                      あ
                    </ThemedText>
                    <ThemedText type="default" style={styles.featureText}>
                      Hiragana - Basic phonetic script
                    </ThemedText>
                  </View>
                  <View style={styles.featureItem}>
                    <ThemedText type="character" style={styles.featureCharacter}>
                      ア
                    </ThemedText>
                    <ThemedText type="default" style={styles.featureText}>
                      Katakana - Angular phonetic script
                    </ThemedText>
                  </View>
                  <View style={styles.featureItem}>
                    <ThemedText type="character" style={styles.featureCharacter}>
                      日
                    </ThemedText>
                    <ThemedText type="default" style={styles.featureText}>
                      Kanji - Ideographic characters
                    </ThemedText>
                  </View>
                </View>
              </Animated.View>

              {/* Auth Section */}
              <Animated.View entering={FadeInUp.delay(300)} style={styles.authSection}>
                <Surface style={styles.authSurface} elevation={2}>
                  <Auth />
                </Surface>
              </Animated.View>
              
              {/* Call to Action */}
              <Animated.View entering={FadeInUp.delay(400)} style={styles.ctaSection}>
                <ThemedText type="default" style={styles.ctaText}>
                  Join thousands of learners mastering Japanese writing!
                </ThemedText>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </PaperProvider>
    );
  }

  // Authenticated user - show full app
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
            <AuthenticatedWelcomeSection session={session} />
            <UserProgressCard session={session} />
            <LearningCards />
          </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Account for tab bar
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  welcomeSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.secondary,
  },
  welcomeDescription: {
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    opacity: 0.9,
  },
  cardsContainer: {
    marginTop: 30,
    gap: 20,
  },
  cardWrapper: {
    width: '100%',
  },
  learningCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  cardCharacter: {
    fontSize: 60,
    marginBottom: 15,
  },
  cardTitle: {
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.8,
  },
  cardButton: {
    borderRadius: 25,
    elevation: 4,
  },
  buttonContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  authSection: {
    marginTop: 40,
  },
  authSurface: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: theme.colors.surface + '95',
  },
  // Authenticated user styles
  userHeader: {
    width: '100%',
    marginBottom: 20,
  },
  userSurface: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: theme.colors.surface + '95',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  avatarLabel: {
    fontSize: 24,
    fontWeight: '600',
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  welcomeBackTitle: {
    color: theme.colors.primary,
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.8,
    fontSize: 14,
  },
  continueTitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    marginTop: 10,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressSurface: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: theme.colors.surface,
  },
  progressTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.onSurface,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  quickActionsSection: {
    marginTop: 20,
  },
  quickActionsTitle: {
    textAlign: 'center',
    marginBottom: 15,
    color: theme.colors.onSurface,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    minWidth: 100,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  // Loading screen styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSurface: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    backgroundColor: theme.colors.surface + '95',
  },
  loadingCharacter: {
    fontSize: 72,
    marginBottom: 20,
    color: theme.colors.primary,
  },
  loadingTitle: {
    marginBottom: 16,
    color: theme.colors.primary,
  },
  loadingSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  // Auth-only view styles
  authOnlyScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  brandingSection: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 30,
  },
  brandingSurface: {
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    backgroundColor: theme.colors.surface + '95',
    width: '100%',
  },
  brandingCharacter: {
    fontSize: 64,
    marginBottom: 16,
    color: theme.colors.primary,
  },
  brandingTitle: {
    marginBottom: 12,
    color: theme.colors.primary,
  },
  brandingSubtitle: {
    marginBottom: 16,
    color: theme.colors.secondary,
  },
  brandingDescription: {
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  featuresPreview: {
    marginBottom: 30,
  },
  featuresTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.onSurface,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface + '60',
    borderRadius: 16,
    padding: 16,
  },
  featureCharacter: {
    fontSize: 32,
    marginRight: 16,
    minWidth: 50,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
    lineHeight: 20,
  },
  ctaSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  ctaText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
});
