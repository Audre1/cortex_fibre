import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusTimeline } from '@/components/StatusTimeline';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function DossierDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const dossierParId = useAppStore((s) => s.dossierParId);
  const dossier = dossierParId(params.id);

  if (!dossier) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Dossier" />
        <View style={styles.empty}>
          <Text style={typography.body as any}>Dossier introuvable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={dossier.numero} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.labelSmall}>ADRESSE</Text>
              <Text style={typography.bodyBold as any}>
                {dossier.adresse.rue}, {dossier.adresse.ville}
              </Text>
            </View>
            <Badge label={dossier.statutGlobal === 'termine' ? 'Terminé' : 'En cours'} tone={dossier.statutGlobal === 'termine' ? 'success' : 'info'} />
          </View>
          {dossier.offre && (
            <Text style={[typography.caption as any, { marginTop: spacing.sm }]}>
              {dossier.offre.nom} · {dossier.offre.prixFCFA.toLocaleString('fr-FR')} FCFA / mois
            </Text>
          )}
          {dossier.dateActivation && (
            <Text style={[typography.caption as any, { marginTop: 2 }]}>Clôturé le {dossier.dateActivation}</Text>
          )}
        </Card>

        <Text style={styles.sectionTitle}>Historique</Text>
        <Card>
          <StatusTimeline etapes={dossier.etapes} />
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.lg },
  card: { marginBottom: spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  labelSmall: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: 2 },
  sectionTitle: { ...(typography.h3 as any), marginBottom: spacing.md },
});
