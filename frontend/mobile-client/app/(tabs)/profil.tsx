import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { codeBox } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

interface RowItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuRow({ icon, label, value, onPress, danger }: RowItem) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.primaryDark} />
      </View>
      <Text style={[typography.body as any, styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      {value ? (
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      )}
    </Pressable>
  );
}

export default function ProfilScreen() {
  const router = useRouter();
  const client = useAppStore((s) => s.client);
  const dossiers = useAppStore((s) => s.dossiers);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={typography.h1 as any}>Profil</Text>

        <View style={styles.profileCard}>
          <Avatar initiales={`${client.prenom.charAt(0)}${client.nom.charAt(0)}`} size={64} />
          <Text style={[typography.h3 as any, styles.profileNom]}>
            {client.prenom.toUpperCase()} {client.nom.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <Card padded={false}>
          <MenuRow icon="person" label="Nom" value={`${client.prenom} ${client.nom}`} />
          <View style={styles.divider} />
          <MenuRow icon="call" label="Numéro" value={`${client.telephone}  ✓`} />
          <View style={styles.divider} />
          <MenuRow icon="hardware-chip" label="Code de la box" value={codeBox} />
          <View style={styles.divider} />
          <MenuRow icon="business" label="Ville" value={client.adresse.ville} />
          <View style={styles.divider} />
          <MenuRow icon="location" label="Adresse d'installation" value={`${client.adresse.rue.split(',')[0]}`} />
        </Card>

        <Text style={styles.sectionTitle}>Abonnements</Text>
        <Card padded={false}>
          <MenuRow icon="wifi" label="Mes lignes Fibre" value={`${dossiers.length} lignes associées`} />
          <View style={styles.divider} />
          <MenuRow icon="hardware-chip-outline" label="Appareils connectés" onPress={() => router.push('/gerer-wifi')} />
        </Card>

        <Text style={styles.sectionTitle}>Assistance</Text>
        <Card padded={false}>
          <MenuRow
            icon="call-outline"
            label="Contacter le service client"
            onPress={() => Alert.alert('Service client', '3900 (appel gratuit depuis une ligne Orange)')}
          />
        </Card>

        <Text style={styles.sectionTitle}>Gestion du compte</Text>
        <Card padded={false}>
          <MenuRow
            icon="language-outline"
            label="Langue"
            value="Français"
            onPress={() => Alert.alert('Langue', 'Une seule langue est disponible pour le moment (démo).')}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="trash-outline"
            label="Supprimer le compte"
            danger
            onPress={() => Alert.alert('Supprimer le compte', 'Cette action est irréversible (démo).')}
          />
          <View style={styles.divider} />
          <MenuRow
            icon="log-out"
            label="Déconnexion"
            onPress={() => router.replace('/')}
          />
        </Card>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  profileCard: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg, paddingVertical: spacing.xl },
  profileNom: { marginTop: spacing.md },
  sectionTitle: { ...(typography.h3 as any), fontSize: 15, color: colors.muted, marginBottom: spacing.sm, marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowIconDanger: { backgroundColor: colors.dangerSoft },
  rowLabel: { flex: 1 },
  rowValue: { color: colors.muted, fontSize: 13, maxWidth: 150 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg + 34 + spacing.md },
});
