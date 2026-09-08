import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface AvatarProps {
  initiales: string;
  size?: number;
  background?: string;
  color?: string;
}

export function Avatar({ initiales, size = 48, background = colors.primary, color = colors.white }: AvatarProps) {
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: background },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.36, color }]}>{initiales}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700' },
});
