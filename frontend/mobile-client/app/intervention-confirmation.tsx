import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function InterventionConfirmationScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);
  const confirmerFinIntervention = useAppStore((s) => s.confirmerFinIntervention);

  function onToutFonctionne() {
    confirmerFinIntervention();
    router.replace('/(tabs)/suivi');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={typography.h3 as any}>Suivi</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
        </View>
        <Text style={[typography.h2 as any, styles.title]}>L'installation est-elle terminée et fonctionnelle ?</Text>
        <Text style={[typography.body as any, styles.subtitle]}>
          Vérifiez votre connexion avant de confirmer.
        </Text>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>RÉSUMÉ DE L'INTERVENTION</Text>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color={colors.muted} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.rowLabel}>Date</Text>
              <Text style={styles.rowValue}>{dossier?.rdv?.date ?? 'Aujourd\'hui'}, {dossier?.rdv?.creneau ?? ''}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color={colors.muted} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.rowLabel}>Adresse</Text>
              <Text style={styles.rowValue}>
                {dossier?.adresse.rue}, {dossier?.adresse.ville}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: spacing.sm }}>
            <InfoBanner text="Clôture technique enregistrée — votre confirmation est encore nécessaire." />
          </View>
        </Card>

        <View style={styles.choiceBlock}>
          <Text style={styles.choiceNumber}>1. Tout fonctionne</Text>
          <Button label="Confirmer l'installation" icon="checkmark-circle" onPress={onToutFonctionne} />
        </View>

        <View style={styles.choiceBlock}>
          <Text style={styles.choiceNumber}>2. Cela ne fonctionne pas</Text>
          <Button
            label="Signaler un problème"
            icon="warning-outline"
            variant="ghost"
            onPress={() => router.replace({ pathname: '/signalement-probleme', params: { motif: 'connexion_ne_fonctionne_pas' } })}
          />
        </View>

        <View style={styles.choiceBlock}>
          <Text style={styles.choiceNumber}>3. L'installation n'a pas été réalisée</Text>
          <Button
            label="Contester l'intervention"
            icon="close-circle-outline"
            variant="ghost"
            onPress={() => router.replace({ pathname: '/signalement-probleme', params: { motif: 'installation_non_realisee' } })}
          />
        </View>

        <Pressable style={styles.laterLink} onPress={() => router.back()}>
          <Text style={styles.laterLinkText}>Me le rappeler plus tard</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, alignItems: 'center' },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.sm },
  card: { marginTop: spacing.xl, width: '100%' },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  rowLabel: { fontSize: 11.5, color: colors.muted },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.ink, marginTop: 1 },
  choiceBlock: { width: '100%', marginTop: spacing.lg },
  choiceNumber: { fontWeight: '700', color: colors.slate, marginBottom: spacing.sm, fontSize: 13.5 },
  laterLink: { marginTop: spacing.lg, paddingVertical: spacing.sm },
  laterLinkText: { color: colors.primaryDark, fontWeight: '600', fontSize: 13.5, textAlign: 'center' },
});
