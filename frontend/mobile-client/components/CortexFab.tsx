import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { CortexRobotIcon } from '@/components/CortexRobotIcon';
import { shadow, spacing } from '@/constants/theme';

interface CortexFabProps {
  // Hauteur de la barre d'onglets sous le bouton, pour rester bien au-dessus
  // (varie selon la zone de sécurité de l'appareil).
  bottomOffset?: number;
}

// Bouton flottant visible sur tous les onglets — accès permanent à
// l'assistant IA Cortex, requis par le brief mais absent de la barre
// d'onglets de la maquette (Suivi / Dossiers / Profil).
export function CortexFab({ bottomOffset = 62 }: CortexFabProps) {
  const router = useRouter();

  return (
    <Pressable
      style={[styles.fab, { bottom: bottomOffset + spacing.md }]}
      onPress={() => router.push('/cortex')}
      accessibilityLabel="Assistant Cortex"
    >
      <CortexRobotIcon size={52} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
});
