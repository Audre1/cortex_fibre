import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickAction } from '@/components/QuickAction';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { numeroLigneFixe } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function AccueilScreen() {
  const router = useRouter();
  const client = useAppStore((s) => s.client);
  const dossier = useAppStore((s) => s.dossier);
  const wifi = useAppStore((s) => s.wifi);
  const hasNonLues = useAppStore((s) => s.notifications.some((n) => !n.lue));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={typography.h2 as any}>Bonjour {client.prenom}</Text>
          <Pressable onPress={() => router.push('/notifications')} hitSlop={10}>
            <Ionicons name="notifications-outline" size={22} color={colors.ink} />
            {hasNonLues && <View style={styles.dot} />}
          </Pressable>
        </View>

        <Card style={styles.boxCard}>
          <View style={styles.boxHeaderRow}>
            <View>
              <Text style={styles.numeroLabel}>Mon numéro fixe</Text>
              <Text style={styles.numeroValue}>{numeroLigneFixe}</Text>
            </View>
            <Badge label={wifi.actif ? 'Actif' : 'Inactif'} tone={wifi.actif ? 'success' : 'danger'} />
          </View>

          <View style={styles.connexionRow}>
            <View style={styles.connexionItem}>
              <View style={[styles.connexionIconWrap, wifi.actif && styles.connexionIconWrapActive]}>
                <Ionicons name="globe-outline" size={16} color={wifi.actif ? colors.primary : colors.muted} />
              </View>
              <Text style={styles.connexionLabel}>Internet</Text>
            </View>
            <View style={styles.connexionLine} />
            <View style={styles.connexionItem}>
              <View style={[styles.connexionIconWrap, styles.connexionIconWrapMain]}>
                <Ionicons name="wifi" size={18} color={colors.white} />
              </View>
              <Text style={styles.connexionLabel}>Box</Text>
            </View>
            <View style={styles.connexionLine} />
            <View style={styles.connexionItem}>
              <View style={[styles.connexionIconWrap, wifi.actif && styles.connexionIconWrapActive]}>
                <Ionicons name="call-outline" size={16} color={wifi.actif ? colors.primary : colors.muted} />
              </View>
              <Text style={styles.connexionLabel}>Ligne fixe</Text>
            </View>
          </View>

          {!wifi.actif && (
            <View style={{ marginTop: spacing.md }}>
              <InfoBanner
                tone="warning"
                icon="alert-circle"
                text="Votre box semble indisponible, veuillez faire un diagnostic pour vérifier."
              />
              <View style={{ marginTop: spacing.sm }}>
                <Button label="Diagnostiquer" onPress={() => router.push('/diagnostic')} />
              </View>
            </View>
          )}
        </Card>

        <View style={styles.grid}>
          <QuickAction icon="wifi" label="Gérer mon WiFi" onPress={() => router.push('/gerer-wifi')} />
          <QuickAction icon="card" label="Me recharger" onPress={() => router.push('/recharge')} />
          <QuickAction icon="document-text" label="Gérer mes demandes" onPress={() => router.push('/mes-demandes')} />
          <QuickAction icon="alert-circle" label="Signaler un problème" onPress={() => router.push('/reclamation')} />
        </View>

        {dossier?.offre && (
          <Pressable onPress={() => router.push('/changement-offre')}>
            <Card style={styles.offreCard}>
              <View style={styles.offreHeaderRow}>
                <Text style={typography.bodyBold as any}>Mon offre</Text>
                <Text style={styles.voirTout}>Voir tout</Text>
              </View>
              <Text style={styles.offreNom}>
                {dossier.offre.nom} {dossier.offre.debit}
              </Text>
              <Text style={typography.caption as any}>Compris dans mon offre</Text>
              <View style={styles.compriChip}>
                <Ionicons name="pricetag-outline" size={13} color={colors.primaryDark} />
                <Text style={styles.compriChipText}>0 FCFA</Text>
              </View>
            </Card>
          </Pressable>
        )}

        <Card style={styles.fideliteCard}>
          <View style={styles.fideliteRow}>
            <View>
              <View style={styles.fideliteBadge}>
                <Ionicons name="star" size={12} color={colors.warning} />
                <Text style={styles.fideliteBadgeText}>Bronze</Text>
              </View>
              <Pressable style={{ marginTop: spacing.sm }}>
                <View style={styles.challengeButton}>
                  <Text style={styles.challengeButtonText}>Challenge</Text>
                </View>
              </Pressable>
            </View>
            <Text style={styles.pointsValue}>00{'\n'}<Text style={styles.pointsLabel}>Pts</Text></Text>
          </View>
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  dot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  boxCard: { backgroundColor: colors.black, borderColor: colors.black, marginBottom: spacing.lg },
  boxHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  numeroLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  numeroValue: { color: colors.white, fontSize: 18, fontWeight: '700', marginTop: 2 },
  connexionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  connexionItem: { alignItems: 'center' },
  connexionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connexionIconWrapActive: { backgroundColor: colors.primarySoft },
  connexionIconWrapMain: { backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 22 },
  connexionLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10.5, marginTop: 6, fontWeight: '600' },
  connexionLine: { width: 24, height: 1.5, backgroundColor: 'rgba(255,255,255,0.2)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  offreCard: { marginBottom: spacing.lg },
  offreHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  voirTout: { fontSize: 12.5, color: colors.primaryDark, fontWeight: '700' },
  offreNom: { fontWeight: '700', fontSize: 14, color: colors.ink },
  compriChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  compriChipText: { marginLeft: 4, fontSize: 11.5, fontWeight: '700', color: colors.primaryDark },
  fideliteCard: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  fideliteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fideliteBadge: { flexDirection: 'row', alignItems: 'center' },
  fideliteBadgeText: { marginLeft: 4, fontWeight: '700', color: colors.ink, fontSize: 13 },
  challengeButton: { backgroundColor: colors.ink, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  challengeButtonText: { color: colors.white, fontSize: 11.5, fontWeight: '700' },
  pointsValue: { fontSize: 26, fontWeight: '800', color: colors.ink, textAlign: 'right' },
  pointsLabel: { fontSize: 11, fontWeight: '600', color: colors.slate },
});
