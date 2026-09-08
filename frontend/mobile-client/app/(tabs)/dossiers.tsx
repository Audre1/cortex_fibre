import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const LABEL_TYPE = {
  installation_fibre: 'INSTALLATION FIBRE',
  depannage_box: 'DÉPANNAGE BOX',
  demenagement: 'DÉMÉNAGEMENT',
  changement_offre: "CHANGEMENT D'OFFRE",
} as const;

export default function DossiersScreen() {
  const router = useRouter();
  const dossiers = useAppStore((s) => s.dossiers);
  const dossierPrincipal = useAppStore((s) => s.dossier);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1 as any}>Dossiers</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {dossiers.map((d) => (
          <Pressable
            key={d.id}
            onPress={() =>
              dossierPrincipal?.id === d.id ? router.push('/(tabs)/suivi') : router.push(`/dossier/${d.id}`)
            }
          >
            <Card style={styles.card}>
              <Text style={styles.labelSmall}>N° DE DOSSIER</Text>
              <Text style={typography.h3 as any}>{d.numero}</Text>
              <Text style={styles.typeLabel}>{LABEL_TYPE[d.type]}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {d.adresse.rue}, {d.adresse.ville}
                </Text>
              </View>

              <View style={styles.footerRow}>
                <View>
                  <Text style={typography.caption as any}>Forfait</Text>
                  <Text style={styles.forfaitText}>{d.offre?.nom}</Text>
                </View>
                <Badge
                  label={d.statutGlobal === 'termine' ? 'Actif' : 'En cours'}
                  tone={d.statutGlobal === 'termine' ? 'success' : 'warning'}
                />
              </View>
            </Card>
          </Pressable>
        ))}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  scroll: { paddingHorizontal: spacing.lg },
  card: { marginBottom: spacing.md },
  labelSmall: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5 },
  typeLabel: { fontSize: 11, fontWeight: '700', color: colors.primaryDark, marginTop: spacing.sm, letterSpacing: 0.3 },
  metaRow: { marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  metaText: { fontSize: 12.5, color: colors.slate },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: spacing.sm },
  forfaitText: { fontWeight: '700', color: colors.ink, fontSize: 13.5 },
});
