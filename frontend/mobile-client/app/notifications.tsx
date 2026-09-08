import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { NotificationCategorie } from '@/data/types';
import { useAppStore } from '@/store/useAppStore';

const TABS: { id: NotificationCategorie | 'toutes'; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'action_requise', label: 'Actions requises' },
  { id: 'rendez_vous', label: 'Rendez-vous' },
];

const ICONES: Record<NotificationCategorie, keyof typeof Ionicons.glyphMap> = {
  action_requise: 'alert-circle',
  rendez_vous: 'car',
  info: 'checkmark-circle',
};

export default function NotificationsScreen() {
  const router = useRouter();
  const notifications = useAppStore((s) => s.notifications);
  const marquerNotificationLue = useAppStore((s) => s.marquerNotificationLue);
  const [tab, setTab] = useState<NotificationCategorie | 'toutes'>('toutes');

  const filtrees = useMemo(
    () => (tab === 'toutes' ? notifications : notifications.filter((n) => n.categorie === tab)),
    [notifications, tab]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Notifications" />

      <View style={styles.titleRow}>
        <Text style={typography.h1 as any}>Boîte de réception</Text>
        <Pressable onPress={() => filtrees.forEach((n) => marquerNotificationLue(n.id))}>
          <Text style={styles.toutLireLink}>Tout lire</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsRow}
      >
        {TABS.map((t) => (
          <Pressable key={t.id} style={[styles.tabChip, tab === t.id && styles.tabChipActive]} onPress={() => setTab(t.id)}>
            <Text
              style={[styles.tabChipText, tab === t.id && styles.tabChipTextActive]}
              numberOfLines={1}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtrees.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.muted} />
            <Text style={[typography.caption as any, { marginTop: spacing.sm }]}>Aucune notification ici.</Text>
          </View>
        ) : (
          filtrees.map((n) => (
            <Pressable key={n.id} onPress={() => marquerNotificationLue(n.id)}>
              <Card style={styles.notifCard}>
                <View style={styles.notifRow}>
                  <View style={[styles.notifIconWrap, !n.lue && styles.notifIconWrapActive]}>
                    <Ionicons
                      name={ICONES[n.categorie]}
                      size={16}
                      color={!n.lue ? colors.white : colors.muted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <View style={styles.notifTitleRow}>
                      <View style={styles.notifTitleWithDot}>
                        {!n.lue && <View style={styles.notifDot} />}
                        <Text style={typography.bodyBold as any} numberOfLines={1}>
                          {n.titre}
                        </Text>
                      </View>
                      <Text style={styles.notifHeure}>{n.heure}</Text>
                    </View>
                    <Text style={typography.caption as any} numberOfLines={2}>
                      {n.description}
                    </Text>
                    {n.categorie === 'action_requise' && !n.lue && (
                      <View style={{ marginTop: spacing.sm }}>
                        <Button
                          label="Confirmer maintenant"
                          size="md"
                          onPress={() => {
                            marquerNotificationLue(n.id);
                            router.push('/(tabs)/suivi');
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            </Pressable>
          ))
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  toutLireLink: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  tabsScroll: { flexGrow: 0, marginBottom: spacing.md },
  tabsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg },
  tabChip: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  tabChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  tabChipText: { fontSize: 12.5, fontWeight: '600', color: colors.slate },
  tabChipTextActive: { color: colors.white },
  scroll: { paddingHorizontal: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  notifCard: { marginBottom: spacing.sm },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start' },
  notifTitleWithDot: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  notifDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: spacing.xs },
  notifIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIconWrapActive: { backgroundColor: colors.primary },
  notifTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifHeure: { fontSize: 11, color: colors.muted, marginLeft: spacing.sm },
});
