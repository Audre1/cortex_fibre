import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';

export default function DemenagementScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Déménagement" />
      <View style={styles.content}>
        <Text style={typography.caption as any}>Transfert de ligne (0)</Text>
        <View style={styles.illustration}>
          <Ionicons name="car-outline" size={44} color={colors.primary} />
        </View>
        <Text style={[typography.h2 as any, styles.title]}>Aucun transfert de ligne</Text>
        <Text style={[typography.body as any, styles.subtitle]}>
          Vous n'avez pas de demande de déménagement ou de transfert de ligne en cours.
        </Text>
        <View style={{ width: '100%', marginTop: spacing.xl }}>
          <Button label="Faire une demande" icon="arrow-forward" iconPosition="right" onPress={() => router.push('/demenagement-nouvelle-demande')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  illustration: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.sm },
});
