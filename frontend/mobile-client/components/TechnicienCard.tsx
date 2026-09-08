import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { Technicien } from '@/data/types';

interface TechnicienCardProps {
  technicien: Technicien;
  heureArrivee?: string;
}

export function TechnicienCard({ technicien, heureArrivee }: TechnicienCardProps) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/technicien/${technicien.id}`)}>
      <Card>
        <View style={styles.row}>
          <Avatar initiales={technicien.initiales} size={52} />
          <View style={styles.info}>
            <Text style={typography.bodyBold as any}>
              {technicien.prenom} {technicien.nom}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color={colors.warning} />
              <Text style={styles.ratingText}>{technicien.note.toFixed(1)} · Technicien Orange</Text>
            </View>
            {heureArrivee && (
              <View style={styles.etaRow}>
                <Ionicons name="time-outline" size={14} color={colors.primaryDark} />
                <Text style={styles.etaText}>Arrivée estimée {heureArrivee}</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginLeft: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  ratingText: { fontSize: 12.5, color: colors.slate, marginLeft: 4, fontWeight: '500' },
  etaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  etaText: { fontSize: 12.5, color: colors.primaryDark, marginLeft: 4, fontWeight: '600' },
});
