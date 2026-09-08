import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { libellesCategorieReclamation } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function ReclamationConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const reclamations = useAppStore((s) => s.reclamations);
  const reclamation = reclamations.find((r) => r.id === params.id) ?? reclamations[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={30} color={colors.white} />
        </View>
        <Text style={[typography.h2 as any, styles.title]}>Votre signalement a bien été{'\n'}pris en compte</Text>
        <Text style={[typography.body as any, styles.subtitle]}>
          Merci. Les informations concernant votre problème ont bien été enregistrées. Vous pourrez suivre son
          traitement depuis votre espace Fibre.
        </Text>

        {reclamation && (
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>RÉFÉRENCE</Text>
            <Text style={styles.numero}>{reclamation.numero}</Text>
            <View style={styles.badgeRow}>
              <Ionicons name="ellipse" size={8} color={colors.primary} />
              <Text style={styles.badgeText}>Signalement reçu</Text>
            </View>

            <Text style={[styles.cardLabel, { marginTop: spacing.lg }]}>PROBLÈME</Text>
            <View style={styles.problemeRow}>
              <Ionicons name="wifi" size={15} color={colors.slate} />
              <Text style={styles.problemeText}>{libellesCategorieReclamation[reclamation.categorie]}</Text>
            </View>

            <Text style={[styles.cardLabel, { marginTop: spacing.lg }]}>PROCHAINES ÉTAPES</Text>
            {reclamation.etapes.map((e, i) => (
              <View key={e.id} style={styles.etapeRow}>
                <View
                  style={[
                    styles.etapeDot,
                    e.statut === 'fait' && styles.etapeDotFait,
                    e.statut === 'en_cours' && styles.etapeDotEnCours,
                  ]}
                />
                <Text style={[styles.etapeText, e.statut === 'a_venir' && styles.etapeTextMuted]}>
                  {i + 1}. {e.titre}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Button label="Retour à mon espace Fibre" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  content: { alignItems: 'center', padding: spacing.xl, paddingTop: spacing.xxl },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.sm },
  card: { marginTop: spacing.xl, width: '100%' },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5 },
  numero: { fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  badgeText: { marginLeft: 5, fontSize: 12.5, fontWeight: '700', color: colors.primaryDark },
  problemeRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  problemeText: { marginLeft: spacing.xs, fontSize: 13.5, fontWeight: '600', color: colors.ink },
  etapeRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  etapeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border, marginRight: spacing.sm },
  etapeDotFait: { backgroundColor: colors.primary },
  etapeDotEnCours: { backgroundColor: colors.primary, opacity: 0.6 },
  etapeText: { fontSize: 13.5, fontWeight: '600', color: colors.ink },
  etapeTextMuted: { color: colors.muted, fontWeight: '400' },
  actions: { padding: spacing.lg },
});
