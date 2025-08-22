import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, Pressable } from 'react-native';
import { Card, useTheme, Text, IconButton } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TestModal: React.FC<{ visible: boolean; onClose: () => void; character: string }> = ({ 
  visible, 
  onClose, 
  character 
}) => {
  const theme = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    console.log('TestModal visibility changed:', visible);
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <Animated.View style={[styles.modalCard, animatedStyle]}>
          <LinearGradient
            colors={[theme.colors.primary + '80', theme.colors.secondary + '80']}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Character Details</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={onClose}
                iconColor="white"
              />
            </View>
            
            <View style={styles.content}>
              <Text style={styles.character}>{character}</Text>
              <Text style={styles.description}>This is a test modal expansion</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const TestCardDisplay: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const theme = useTheme();

  const testData = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];

  const handleCardPress = (character: string) => {
    console.log('Test card pressed:', character);
    setSelectedCharacter(character);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    console.log('Closing test modal');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {testData.map((character, index) => (
          <Pressable
            key={character}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleCardPress(character)}
          >
            <Text style={[styles.cardText, { color: theme.colors.onSurface }]}>
              {character}
            </Text>
          </Pressable>
        ))}
      </View>

      <TestModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        character={selectedCharacter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (screenWidth - 80) / 5,
    height: (screenWidth - 80) / 5,
    margin: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalCard: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.6,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default TestCardDisplay;
