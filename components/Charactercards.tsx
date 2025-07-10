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

  if (dataArray.length > 46) {
    const firstPart = dataArray.slice(0, 46);
    const secondPart = dataArray.slice(46);

    return (
      <View>
        <FlatList
          data={firstPart}
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
        <View style={{ height: 20 }} />
        <FlatList
          data={secondPart}
          keyExtractor={([key]) => key}
          numColumns={4}
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
      </View>
    );
  }

  if (dataArray.length === 46) {
    const mid = Math.ceil(dataArray.length / 2);
    const firstHalf = dataArray.slice(0, mid);
    const secondHalf = dataArray.slice(mid);

    return (
      <View>
        <FlatList
          data={firstHalf}
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
        <View style={{ height: 20 }} />
        <FlatList
          data={secondHalf}
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
      </View>
    );
  }

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
