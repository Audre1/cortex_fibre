import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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

// Version native (iOS/Android) — utilisée automatiquement par Metro sur ces
// plateformes. Le web charge EligibiliteMap.web.tsx à la place (react-native-maps
// n'est pas supporté sur web).
export function EligibiliteMap({ coords, loading, height }: EligibiliteMapProps) {
  if (loading || !coords) {
    return (
      <View style={[styles.loading, { height }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ height }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker coordinate={coords}>
          <View style={styles.pinWrap}>
            <Ionicons name="location" size={26} color={colors.white} />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.infoSoft },
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
