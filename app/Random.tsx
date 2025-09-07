import React from 'react';
import { StyleSheet, Text } from 'react-native';

const Random = () => {
  return (
          <Text>Youre in the random page</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Random;