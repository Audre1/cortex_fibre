import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { libellesCategorieReclamation } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

const LABEL_PAR_STATUT = { ouverte: 'Ouverte', en_traitement: 'En cours de traitement', resolue: 'Résolue' } as const;

export default function SuiviReclamationScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const reclamations = useAppStore((s) => s.reclamations);
  const reclamation = reclamations.find((r) => r.id === params.id);

  if (!reclamation) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Suivi de ma réclamation" />
        <View style={styles.empty}>
          <Text style={typography.body as any}>Réclamation introuvable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Suivi de ma réclamation" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={typography.bodyBold as any}>Réf. {reclamation.numero}</Text>
          <Badge label={libellesCategorieReclamation[reclamation.categorie]} tone="neutral" />
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>STATUT ACTUEL</Text>
          <Text style={typography.h3 as any}>{LABEL_PAR_STATUT[reclamation.statut]}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Historique du traitement</Text>
        <Card>
          {reclamation.etapes.map((e, i) => (
            <View key={e.id} style={[styles.etapeRow, i < reclamation.etapes.length - 1 && styles.etapeRowBorder]}>
              <View
                style={[
                  styles.etapeDot,
                  e.statut === 'fait' && styles.etapeDotFait,
                  e.statut === 'en_cours' && styles.etapeDotEnCours,
                ]}
              />
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={[typography.bodyBold as any, e.statut === 'a_venir' && styles.textMuted]}>{e.titre}</Text>
                {e.date && <Text style={typography.caption as any}>{e.date}</Text>}
              </View>
            </View>
          ))}
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <InfoBanner
            icon="information-circle"
            text="Notre équipe d'experts analyse actuellement votre dossier. Nous vous tiendrons informé de son évolution."
          />
        </View>

        <Pressable style={styles.addLink}>
          <Text style={styles.addLinkText}>+ Ajouter une information</Text>
        </Pressable>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  card: { marginBottom: spacing.xl },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: 2 },
  sectionTitle: { ...(typography.h3 as any), marginBottom: spacing.md },
  etapeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.sm },
  etapeRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  etapeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.border, marginTop: 3 },
  etapeDotFait: { backgroundColor: colors.success },
  etapeDotEnCours: { backgroundColor: colors.primary },
  textMuted: { color: colors.muted },
  addLink: { alignItems: 'center', marginTop: spacing.lg },
  addLinkText: { color: colors.primaryDark, fontWeight: '600', fontSize: 13 },
});
