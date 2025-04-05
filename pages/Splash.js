import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

export const MatrixSplash = ({ navigation }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const matrixAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    matrixAnimation();

    // Navigate to the next screen after 2 seconds
    setTimeout(() => {
      navigation.replace('Login'); // Use replace to prevent going back to Splash
    }, 2000);
  }, [navigation]);

  const matrixText = "0101010100101010101100101011001010010101010110001"; // Example matrix text

  return (
    <View style={styles.splashContainer}>
      <Animated.Text style={[styles.matrixText, { opacity: animatedValue }]}>
        {matrixText}
      </Animated.Text>
    </View>
  );
};



const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  matrixText: {
    color: 'green',
    fontSize: 30,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  homeText: {
    fontSize: 24,
  },
});
