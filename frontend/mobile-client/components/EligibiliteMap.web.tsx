import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

interface Coords {
  latitude: number;
  longitude: number;
}

interface EligibiliteMapProps {
  coords: Coords | null;
  loading: boolean;
  height: number;
}

// Repli web — react-native-maps n'est pas supporté sur cette plateforme.
// On garde une bannière décorative pour ne pas casser le rendu web.
export function EligibiliteMap({ loading, height }: EligibiliteMapProps) {
  return (
    <View style={[styles.wrap, { height }]}>
      <View style={styles.grid} pointerEvents="none">
        {Array.from({ length: 24 }).map((_, i) => (
          <View key={i} style={[styles.dot, { height: height / 4 }]} />
        ))}
      </View>
      {loading ? (
        <ActivityIndicator color={colors.info} />
      ) : (
        <View style={styles.pinWrap}>
          <Ionicons name="location" size={26} color={colors.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.infoSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  grid: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', flexWrap: 'wrap', opacity: 0.5 },
  dot: { width: '16.6%', borderWidth: 1, borderColor: 'rgba(10,110,209,0.08)' },
  pinWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
});
