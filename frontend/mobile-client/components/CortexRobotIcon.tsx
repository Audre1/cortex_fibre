import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface CortexRobotIconProps {
  size?: number;
}

// Mascotte de l'assistant Cortex.
export function CortexRobotIcon({ size = 24 }: CortexRobotIconProps) {
  return (
    <Image
      source={require('../assets/images/cortex-robot.jpg')}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {},
});
