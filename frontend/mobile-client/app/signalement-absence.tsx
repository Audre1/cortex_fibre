import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function SignalementAbsenceScreen() {
  const router = useRouter();
  const signalerTechnicienAbsent = useAppStore((s) => s.signalerTechnicienAbsent);
  const [envoye, setEnvoye] = useState(false);

  function onConfirmer() {
    signalerTechnicienAbsent();
    setEnvoye(true);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {!envoye ? (
          <>
            <View style={[styles.iconWrap, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="alert-circle" size={48} color={colors.warning} />
            </View>
            <Text style={[typography.h2 as any, styles.title]}>Le technicien n'est pas arrivé ?</Text>
            <Text style={[typography.body as any, styles.subtitle]}>
              Nous allons prévenir nos équipes et vous recontacter rapidement pour reprogrammer si besoin.
            </Text>
          </>
        ) : (
          <>
            <View style={[styles.iconWrap, { backgroundColor: colors.successSoft }]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            </View>
            <Text style={[typography.h2 as any, styles.title]}>Signalement transmis</Text>
            <Text style={[typography.body as any, styles.subtitle]}>
              Un conseiller Orange va revenir vers vous très vite. Vous pouvez aussi déposer une réclamation si
              besoin.
            </Text>
          </>
        )}
      </View>

      <View style={styles.actions}>
        {!envoye ? (
          <>
            <Button label="Confirmer le signalement" icon="megaphone" onPress={onConfirmer} />
            <View style={{ marginTop: spacing.sm }}>
              <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
            </View>
          </>
        ) : (
          <>
            <Button label="Retour au suivi" onPress={() => router.replace('/(tabs)/suivi')} />
            <View style={{ marginTop: spacing.sm }}>
              <Button label="Faire une réclamation" variant="ghost" onPress={() => router.replace('/reclamation')} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.sm },
  actions: { padding: spacing.lg },
});
