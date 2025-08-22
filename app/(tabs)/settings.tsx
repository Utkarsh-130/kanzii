import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Surface, Button, TextInput, Avatar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Session } from '@supabase/supabase-js';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Auth from '@/components/Auth';
import { theme } from '@/components/theme';
import { supabase } from '@/components/utils/supabase';

interface SettingsProps {
  session: Session;
}

function SettingsContent({ session }: SettingsProps) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || '');
        setWebsite(data.website || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => supabase.auth.signOut(),
        },
      ]
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface + '50']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Surface style={styles.headerSurface} elevation={2}>
              <ThemedText type="heading" style={styles.title}>
                Settings
              </ThemedText>
              <ThemedText type="default" style={styles.subtitle}>
                Manage your profile and preferences
              </ThemedText>
            </Surface>
          </Animated.View>

          {/* Profile Section */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <View style={styles.avatarSection}>
                  <Avatar.Text
                    size={80}
                    label={username ? username.charAt(0).toUpperCase() : session?.user?.email?.charAt(0).toUpperCase() || 'U'}
                    style={styles.avatar}
                    labelStyle={styles.avatarText}
                  />
                  <View style={styles.userInfo}>
                    <ThemedText type="subtitle" style={styles.userEmail}>
                      {session?.user?.email}
                    </ThemedText>
                    <ThemedText type="default" style={styles.userStatus}>
                      Active Account
                    </ThemedText>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Edit Profile Section */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <Card style={styles.editCard}>
              <Card.Content>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Profile Information
                </ThemedText>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Email"
                    value={session?.user?.email || ''}
                    disabled
                    mode="outlined"
                    style={styles.input}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                    placeholder="Enter your username"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Website"
                    value={website}
                    onChangeText={setWebsite}
                    mode="outlined"
                    style={styles.input}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                    placeholder="https://your-website.com"
                    keyboardType="url"
                  />
                </View>

                <Button
                  mode="contained"
                  onPress={updateProfile}
                  loading={updating}
                  disabled={updating}
                  style={styles.updateButton}
                  contentStyle={styles.buttonContent}
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Account Actions */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Card style={styles.actionsCard}>
              <Card.Content>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Account Actions
                </ThemedText>
                
                <Button
                  mode="outlined"
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                  contentStyle={styles.buttonContent}
                  textColor={theme.colors.error}
                  buttonColor="transparent"
                >
                  Sign Out
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Spacer for tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSurface: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: theme.colors.surface + '95',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  profileContent: {
    padding: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  userStatus: {
    color: theme.colors.primary,
    fontSize: 14,
    opacity: 0.8,
  },
  editCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  actionsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  updateButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  signOutButton: {
    borderRadius: 12,
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  // Auth styles
  authContainer: {
    flex: 1,
  },
  authSafeArea: {
    flex: 1,
  },
  authScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  authSection: {
    marginTop: 40,
  },
  authSurface: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: theme.colors.surface + '95',
  },
  authTitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: theme.colors.primary,
  },
});

// Main Settings component that handles authentication
export default function Settings() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // If not authenticated, show auth screen
  if (!session || !session.user) {
    return (
      <ThemedView style={styles.authContainer}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface + '50']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.authSafeArea}>
            <ScrollView 
              contentContainerStyle={styles.authScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View entering={FadeInDown.delay(100)}>
                <Surface style={styles.headerSurface} elevation={2}>
                  <ThemedText type="heading" style={styles.authTitle}>
                    Settings
                  </ThemedText>
                  <ThemedText type="default" style={styles.subtitle}>
                    Please sign in to access your settings
                  </ThemedText>
                </Surface>
              </Animated.View>
              
              <Animated.View entering={FadeInDown.delay(200)} style={styles.authSection}>
                <Surface style={styles.authSurface} elevation={2}>
                  <Auth />
                </Surface>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ThemedView>
    );
  }

  // If authenticated, show settings content
  return <SettingsContent session={session} />;
}
