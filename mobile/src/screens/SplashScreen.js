import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 2500, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../../assets/splash.png')}
        style={[
          styles.splashImage,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: width,
    height: height,
  }
});

export default SplashScreen;
