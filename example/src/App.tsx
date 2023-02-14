import * as React from 'react';

import { StyleSheet, View, Alert } from 'react-native';
import { EasterEgg, Directions } from 'react-native-easter-egg';

const secretCode = [
  Directions.UP,
  Directions.DOWN,
  Directions.LEFT,
  Directions.RIGHT,
];

export default function App() {
  const handleCodeInputSuccess = () => Alert.alert('Hello', ':D');

  return (
    <View style={styles.container}>
      <EasterEgg
        onCodeInputSuccess={handleCodeInputSuccess}
        secretCode={secretCode}
      >
        <View style={styles.box} />
      </EasterEgg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: 'red',
  },
});
