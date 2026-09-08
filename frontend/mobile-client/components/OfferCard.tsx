import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import { Offre } from '@/data/types';

interface OfferCardProps {
  offre: Offre;
  selected: boolean;
  onPress: () => void;
}

export function OfferCard({ offre, selected, onPress }: OfferCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      {selected && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={13} color={colors.white} />
        </View>
      )}
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Ionicons name={offre.icone as any} size={22} color={selected ? colors.white : colors.primary} />
      </View>
      <Text style={typography.bodyBold as any}>{offre.nom}</Text>
      <Text style={styles.debit}>{offre.debit}</Text>
      <Text style={styles.prix}>
        {offre.prixFCFA.toLocaleString('fr-FR')} <Text style={styles.prixUnit}>FCFA/mois</Text>
      </Text>
      {offre.avantages.slice(0, 2).map((a) => (
        <View key={a} style={styles.avantageRow}>
          <Ionicons name="checkmark-circle" size={13} color={colors.success} />
          <Text style={styles.avantageText} numberOfLines={1}>
            {a}
          </Text>
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  checkBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconWrapSelected: { backgroundColor: colors.primary },
  debit: { fontSize: 12.5, color: colors.slate, marginTop: 2, marginBottom: spacing.xs },
  prix: { fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  prixUnit: { fontSize: 11, fontWeight: '600', color: colors.muted },
  avantageRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  avantageText: { fontSize: 11.5, color: colors.slate, marginLeft: 4, flexShrink: 1 },
});
