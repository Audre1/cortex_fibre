import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  showNotifications?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightAction,
  showNotifications = false,
}: ScreenHeaderProps) {
  const router = useRouter();
  const hasNonLues = useAppStore((s) => s.notifications.some((n) => !n.lue));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            onPress={onBack ?? (() => router.back())}
            hitSlop={12}
            style={styles.backButton}
            accessibilityLabel="Retour"
          >
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <View style={styles.titleWrap}>
          <Text style={typography.h2 as any} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[typography.caption as any, styles.subtitle]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.rightSlot}>
          {rightAction}
          {showNotifications && !rightAction && (
            <Pressable onPress={() => router.push('/notifications')} hitSlop={12} style={styles.bellButton}>
              <Ionicons name="notifications-outline" size={22} color={colors.ink} />
              {hasNonLues && <View style={styles.bellDot} />}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  backButtonPlaceholder: { width: 36, marginRight: spacing.sm },
  titleWrap: { flex: 1 },
  subtitle: { marginTop: 2 },
  rightSlot: { minWidth: 36, alignItems: 'flex-end' },
  bellButton: { padding: 4 },
  bellDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});
