import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function TechnicienDetailScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);
  const technicien = dossier?.technicien;

  if (!technicien) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Technicien" />
        <View style={styles.empty}>
          <Text style={typography.body as any}>Aucun technicien assigné pour le moment.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Mon technicien" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileHeader}>
          <Avatar initiales={technicien.initiales} size={84} />
          <Text style={[typography.h2 as any, styles.name]}>
            {technicien.prenom} {technicien.nom}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={15} color={colors.warning} />
            <Text style={styles.ratingText}>{technicien.note.toFixed(1)} · Technicien certifié Orange</Text>
          </View>
        </View>

        {dossier.rdv && (
          <Card style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.infoText}>Rendez-vous : {dossier.rdv.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="hourglass-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.infoText}>Arrivée estimée : {technicien.heureArriveeEstimee}</Text>
            </View>
          </Card>
        )}

        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="car-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.infoText}>{technicien.vehicule}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.infoText}>Immatriculation : {technicien.immatriculation}</Text>
          </View>
        </Card>

        <View style={styles.actionsRow}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <Button
              label="Appeler"
              icon="call"
              variant="secondary"
              onPress={() => Linking.openURL(`tel:${technicien.telephone.replace(/\s/g, '')}`)}
            />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Button
              label="Message"
              icon="chatbubble"
              onPress={() => router.push(`/chat/${technicien.id}`)}
            />
          </View>
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Button
            label="Signaler une absence"
            icon="alert-circle-outline"
            variant="ghost"
            onPress={() => router.push('/signalement-absence')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  profileHeader: { alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
  name: { marginTop: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  ratingText: { marginLeft: 4, color: colors.slate, fontWeight: '500', fontSize: 13.5 },
  card: { marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  infoText: { marginLeft: spacing.sm, ...(typography.body as any) },
  actionsRow: { flexDirection: 'row', marginTop: spacing.lg },
});
