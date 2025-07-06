import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

type CardDisplayProps = {
  data: Record<string, any>;
  renderItem: (key: string, details: any) => React.ReactNode;
};

const CardDisplay: React.FC<CardDisplayProps> = ({ data, renderItem }) => {
  const dataArray = Object.entries(data);
  const theme = useTheme();

  return (
    <FlatList
      data={dataArray}
      keyExtractor={([key]) => key}
      numColumns={5}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <Card
            style={{
              margin: 5,
              borderColor: theme.colors.primary,
              borderWidth: 1,
              backgroundColor: theme.colors.background,
            }}
          >
            <Card.Content>
              {renderItem(item[0], item[1])}
            </Card.Content>
          </Card>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    minWidth: 0,
  },
});

export default CardDisplay;
