import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { libellesCategorieReclamation } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

const TONE_PAR_STATUT = { ouverte: 'info', en_traitement: 'warning', resolue: 'success' } as const;
const LABEL_PAR_STATUT = { ouverte: 'Ouverte', en_traitement: 'En traitement', resolue: 'Résolue' } as const;

export default function ReclamationsScreen() {
  const router = useRouter();
  const reclamations = useAppStore((s) => s.reclamations);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Réclamations" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={typography.h1 as any}>Réclamations</Text>

        {reclamations.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.illustration}>
              <Ionicons name="briefcase-outline" size={38} color={colors.primary} />
            </View>
            <Text style={[typography.body as any, styles.emptyText]}>
              Vous n'avez aucune réclamation en cours
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            {reclamations.map((r) => (
              <Pressable key={r.id} onPress={() => router.push(`/reclamation/${r.id}`)}>
                <Card style={styles.card}>
                  <View style={styles.rowBetween}>
                    <Text style={typography.bodyBold as any}>{r.numero}</Text>
                    <Badge label={LABEL_PAR_STATUT[r.statut]} tone={TONE_PAR_STATUT[r.statut]} />
                  </View>
                  <Text style={[typography.caption as any, { marginTop: 4 }]}>
                    {libellesCategorieReclamation[r.categorie]}
                  </Text>
                </Card>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Button label="Faire une réclamation" icon="add" onPress={() => router.push('/reclamation')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl * 1.5 },
  illustration: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyText: { color: colors.slate },
  card: { marginBottom: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
