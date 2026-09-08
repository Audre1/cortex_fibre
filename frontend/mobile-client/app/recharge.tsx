import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { numeroLigneFixe, optionsRecharge } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function RechargeScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);
  const effectuerRecharge = useAppStore((s) => s.effectuerRecharge);
  const rechargeEnCours = useAppStore((s) => s.rechargeEnCours);

  const [optionId, setOptionId] = useState(optionsRecharge[0].id);
  const option = optionsRecharge.find((o) => o.id === optionId) ?? optionsRecharge[0];

  async function onConfirmer() {
    await effectuerRecharge(optionId);
    Alert.alert('Paiement confirmé', `Votre ligne a été rechargée pour ${option.dureeLabel}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Rechargement" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.ligneCard}>
          <Text style={styles.ligneLabel}>LIGNE SÉLECTIONNÉE</Text>
          <Text style={typography.h3 as any}>{numeroLigneFixe}</Text>
          <Text style={typography.caption as any}>{dossier?.offre?.nom} {dossier?.offre?.debit}</Text>
        </Card>

        <Text style={[typography.h3 as any, styles.sectionTitle]}>Recharger ma Fibre</Text>
        <View style={styles.grid}>
          {optionsRecharge.map((o) => (
            <Pressable key={o.id} style={[styles.optionCard, optionId === o.id && styles.optionCardActive]} onPress={() => setOptionId(o.id)}>
              {optionId === o.id && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={11} color={colors.white} />
                </View>
              )}
              <Text style={[typography.bodyBold as any, optionId === o.id && styles.optionTextActive]}>{o.dureeLabel}</Text>
              <Text style={[styles.optionPrix, optionId === o.id && styles.optionTextActive]}>
                {o.prixFCFA.toLocaleString('fr-FR')} FCFA
              </Text>
            </Pressable>
          ))}
        </View>

        <Card style={styles.recapCard}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Durée</Text>
            <Text style={styles.recapValue}>{option.dureeLabel}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Total à payer</Text>
            <Text style={styles.recapTotal}>{option.prixFCFA.toLocaleString('fr-FR')} FCFA</Text>
          </View>

          <View style={styles.paiementRow}>
            <View style={styles.paiementIcon}>
              <Ionicons name="wallet-outline" size={18} color={colors.primaryDark} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={typography.bodyBold as any}>Orange Money</Text>
              <Text style={typography.caption as any}>+225 07•••3236</Text>
            </View>
            <Pressable hitSlop={8}>
              <Ionicons name="pencil" size={16} color={colors.muted} />
            </Pressable>
          </View>
          <Pressable>
            <Text style={styles.tiersLink}>‹ Faire payer par un tiers</Text>
          </Pressable>
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            label="Confirmer le paiement"
            icon="lock-closed"
            iconPosition="right"
            loading={rechargeEnCours}
            onPress={onConfirmer}
          />
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg },
  ligneCard: { marginBottom: spacing.lg },
  ligneLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: 2 },
  sectionTitle: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  optionCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  optionCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionTextActive: { color: colors.white },
  optionPrix: { fontSize: 13, color: colors.slate, marginTop: 2, fontWeight: '600' },
  checkBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapCard: { marginTop: spacing.sm },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  recapLabel: { color: colors.muted, fontSize: 13.5 },
  recapValue: { fontWeight: '700', fontSize: 13.5 },
  recapTotal: { fontWeight: '800', fontSize: 16, color: colors.primaryDark },
  paiementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  paiementIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiersLink: { marginTop: spacing.sm, color: colors.primaryDark, fontSize: 12.5, fontWeight: '600' },
});
