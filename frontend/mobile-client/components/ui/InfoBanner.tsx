import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';

interface InfoBannerProps {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: 'info' | 'warning';
}

export function InfoBanner({ text, icon = 'information-circle', tone = 'info' }: InfoBannerProps) {
  const t = tone === 'warning' ? { bg: colors.warningSoft, fg: colors.warning } : { bg: colors.infoSoft, fg: colors.info };

  return (
    <View style={[styles.wrap, { backgroundColor: t.bg }]}>
      <Ionicons name={icon} size={18} color={t.fg} style={styles.icon} />
      <Text style={[typography.caption as any, styles.text, { color: t.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  icon: { marginRight: spacing.sm, marginTop: 1 },
  text: { flex: 1, lineHeight: 18 },
});
