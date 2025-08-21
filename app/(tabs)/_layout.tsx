import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { theme } from '@/components/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: styles.modernTabBar,
          tabBarBackground: () => (
            <LinearGradient
              colors={[colors.surface + 'F0', colors.surfaceVariant + 'F0']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          ),
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 28 : 24} 
                name="house.fill" 
                color={color}
                style={focused ? styles.activeIcon : undefined} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="HiraganaScreen"
          options={{
            title: 'Hiragana',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 28 : 24} 
                name="textformat" 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Katakana"
          options={{
            title: 'Katakana',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 28 : 24} 
                name="character.book.closed" 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="KanjiFlashcards"
          options={{
            title: 'Kanji',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 28 : 24} 
                name="book.closed" 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol 
                size={focused ? 28 : 24} 
                name="sparkles" 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modernTabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 25,
    elevation: 15,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline + '30',
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabBarIcon: {
    marginBottom: -3,
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
});
