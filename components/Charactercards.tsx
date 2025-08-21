import React from 'react';
import { FlatList, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type CardDisplayProps = {
  data: Record<string, any>;
  renderItem: (key: string, details: any) => React.ReactNode;
};

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 5; // 5 columns with margins

const AnimatedCard: React.FC<{
  item: [string, any];
  renderItem: (key: string, details: any) => React.ReactNode;
  index: number;
  theme: any;
}> = ({ item, renderItem, index, theme }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  
  React.useEffect(() => {
    const delay = index * 50; // Stagger animation
    setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 200,
      });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    'worklet';
    scale.value = withSpring(0.95, { duration: 100 });
    setTimeout(() => {
      scale.value = withSpring(1, { duration: 100 });
    }, 100);
  };

  return (
    <Animated.View style={[animatedStyle, styles.cardContainer]}>
      <Card
        onPress={handlePress}
        style={[
          styles.modernCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
          }
        ]}
        contentStyle={styles.cardContent}
      >
        <LinearGradient
          colors={[theme.colors.primary + '20', theme.colors.secondary + '20']}
          style={styles.gradientOverlay}
        >
          <View style={styles.characterContainer}>
            {renderItem(item[0], item[1])}
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );
};

const CardDisplay: React.FC<CardDisplayProps> = ({ data, renderItem }) => {
  const dataArray = Object.entries(data);
  const theme = useTheme();

  const renderAnimatedItem = ({ item, index }: { item: [string, any]; index: number }) => (
    <AnimatedCard
      item={item}
      renderItem={renderItem}
      index={index}
      theme={theme}
    />
  );

  if (dataArray.length > 46) {
    const firstPart = dataArray.slice(0, 46);
    const secondPart = dataArray.slice(46);

    return (
      <View style={styles.container}>
        <FlatList
          data={firstPart}
          keyExtractor={([key]) => key}
          numColumns={5}
          renderItem={renderAnimatedItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.sectionSpacer} />
        <FlatList
          data={secondPart}
          keyExtractor={([key]) => key}
          numColumns={4}
          renderItem={renderAnimatedItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  }

  if (dataArray.length === 46) {
    const mid = Math.ceil(dataArray.length / 2);
    const firstHalf = dataArray.slice(0, mid);
    const secondHalf = dataArray.slice(mid);

    return (
      <View style={styles.container}>
        <FlatList
          data={firstHalf}
          keyExtractor={([key]) => key}
          numColumns={5}
          renderItem={renderAnimatedItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.sectionSpacer} />
        <FlatList
          data={secondHalf}
          keyExtractor={([key]) => key}
          numColumns={5}
          renderItem={renderAnimatedItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={dataArray}
      keyExtractor={([key]) => key}
      numColumns={5}
      renderItem={renderAnimatedItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionSpacer: {
    height: 30,
  },
  cardContainer: {
    flex: 1,
    margin: 4,
    minWidth: cardWidth,
    maxWidth: cardWidth,
  },
  modernCard: {
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1.5,
    overflow: 'hidden',
    height: cardWidth,
  },
  cardContent: {
    padding: 0,
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default CardDisplay;
