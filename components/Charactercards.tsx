import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Dimensions, Platform, Modal, Pressable } from 'react-native';
import { Card, useTheme, Text, IconButton } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
  useAnimatedGestureHandler,
  PanGestureHandler,
  Gesture,
  GestureDetector,
  withDelay,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type CardDisplayProps = {
  data: Record<string, any>;
  renderItem: (key: string, details: any) => React.ReactNode;
};

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 5; // 5 columns with margins

// Floating Particle Animation Component
const FloatingParticle: React.FC<{ theme: any; delay: number }> = ({ theme, delay }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    const animate = () => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000 }),
          withTiming(20, { duration: 2000 })
        ),
        -1,
        true
      );
      
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(0.2, { duration: 1500 })
        ),
        -1,
        true
      );
      
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 3000 }),
          withTiming(0.8, { duration: 3000 })
        ),
        -1,
        true
      );
    };
    
    setTimeout(animate, delay);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View style={[styles.floatingParticle, animatedStyle]}>
      <View style={[styles.particle, { backgroundColor: theme.colors.primary + '60' }]} />
    </Animated.View>
  );
};

// Expandable Modal Component
const ExpandedCardModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  item: [string, any];
  renderItem: (key: string, details: any) => React.ReactNode;
  theme: any;
}> = ({ visible, onClose, item, renderItem, theme }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const translateY = useSharedValue(50);
  const translateX = useSharedValue(0);
  
  // Gesture handling for swipe to close
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      // Reduce opacity based on swipe distance
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      opacity.value = Math.max(0.3, 1 - distance / 300);
    })
    .onEnd((event) => {
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      if (distance > 150) {
        // Close modal if swipe distance is large
        runOnJS(onClose)();
      } else {
        // Snap back to original position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        opacity.value = withTiming(1);
      }
    });
  
  React.useEffect(() => {
    console.log('Modal visibility changed:', visible);
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
      rotateY.value = withTiming(0, { duration: 300 }); // Simplified rotation
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(50, { duration: 200 });
      translateX.value = withTiming(0, { duration: 200 });
      rotateY.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);
  
  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value + 50 },
        { translateX: translateX.value },
        { rotateY: `${rotateY.value}deg` },
      ],
      opacity: opacity.value,
    };
  });
  
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value * 0.8,
    };
  });
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalBackground, backgroundAnimatedStyle]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        </Animated.View>
        
        <Animated.View style={[styles.expandedCard, modalAnimatedStyle]}>
          <LinearGradient
            colors={[
              theme.colors.primary + '90',
              theme.colors.secondary + '90',
            ]}
            style={styles.expandedGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Close Button */}
            <View style={styles.closeButtonContainer}>
              <IconButton
                icon="close"
                size={24}
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                iconColor="white"
              />
            </View>
            
            {/* Main Character Display */}
            <View style={styles.expandedCharacterContainer}>
              <View style={styles.mainCharacterWrapper}>
                {renderItem(item[0], item[1])}
              </View>
            </View>
            
            {/* Character Details */}
            <View style={styles.characterDetails}>
              <Text style={[styles.characterKey, { color: 'white' }]}>
                {item[0]}
              </Text>
              {item[1].meaning && (
                <Text style={[styles.characterMeaning, { color: 'white' }]}>
                  {item[1].meaning}
                </Text>
              )}
              {item[1].reading && (
                <Text style={[styles.characterReading, { color: 'rgba(255,255,255,0.9)' }]}>
                  {item[1].reading}
                </Text>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const AnimatedCard: React.FC<{
  item: [string, any];
  renderItem: (key: string, details: any) => React.ReactNode;
  index: number;
  theme: any;
}> = ({ item, renderItem, index, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  
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
        { scale: scale.value * pulseScale.value },
        { translateY: translateY.value },
        { rotateZ: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    console.log('Card pressed!', item[0]);
    
    // Animate first, then open modal
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1.05, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    
    rotation.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    
    // Open modal immediately (don't wait for animation)
    setIsExpanded(true);
    console.log('Modal should be opening...');
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
  };

  return (
    <>
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
      
      <ExpandedCardModal
        visible={isExpanded}
        onClose={handleCloseExpanded}
        item={item}
        renderItem={renderItem}
        theme={theme}
      />
    </>
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
  // Expanded Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  expandedCard: {
    width: screenWidth * 0.85,
    maxWidth: 400,
    aspectRatio: 0.8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  expandedCardContent: {
    flex: 1,
    borderRadius: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    borderWidth: 2,
  },
  expandedGradient: {
    flex: 1,
    padding: 24,
    borderRadius: 22,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    borderRadius: 20,
    elevation: 4,
  },
  expandedCharacterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  mainCharacterWrapper: {
    transform: [{ scale: 2.5 }],
    padding: 20,
  },
  characterDetails: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  characterKey: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  characterMeaning: {
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
  characterReading: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  // Floating Particle Styles
  floatingParticle: {
    position: 'absolute',
    top: Math.random() * 80 + '%',
    left: Math.random() * 80 + '%',
  },
  particle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    elevation: 2,
  },
});

export default CardDisplay;
