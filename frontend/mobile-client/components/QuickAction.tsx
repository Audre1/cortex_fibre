import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '@/constants/theme';

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'neutral';
}

export function QuickAction({ icon, label, onPress, tone = 'neutral' }: QuickActionProps) {
  const isPrimary = tone === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, isPrimary && styles.cardPrimary, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, isPrimary && styles.iconWrapPrimary]}>
        <Ionicons name={icon} size={22} color={isPrimary ? colors.white : colors.primary} />
      </View>
      <Text style={[typography.bodyBold as any, styles.label, isPrimary && styles.labelPrimary]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 2,
  },
  iconWrapPrimary: { backgroundColor: 'rgba(255,255,255,0.2)' },
  label: { fontSize: 14 },
  labelPrimary: { color: colors.white },
});
