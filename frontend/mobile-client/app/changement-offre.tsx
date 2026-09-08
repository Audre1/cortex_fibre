import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OfferCard } from '@/components/OfferCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { offres } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function ChangementOffreScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);
  const offreActuelle = dossier?.offre ?? offres[0];
  const [selection, setSelection] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Changer mon offre" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={typography.bodyBold as any}>Votre offre actuelle</Text>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={offreActuelle.icone as any} size={18} color={colors.white} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={typography.bodyBold as any}>{offreActuelle.nom}</Text>
              <Text style={typography.caption as any}>{offreActuelle.prixFCFA.toLocaleString('fr-FR')} FCFA / mois</Text>
            </View>
            <Badge label="Actuelle" tone="warning" />
          </View>
        </Card>

        <Text style={[typography.bodyBold as any, styles.sectionSpacing]}>Nouvelles offres disponibles</Text>
        <View style={styles.grid}>
          {offres
            .filter((o) => o.id !== offreActuelle.id)
            .map((o) => (
              <OfferCard key={o.id} offre={o} selected={selection === o.id} onPress={() => setSelection(o.id)} />
            ))}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            label="Valider le changement"
            disabled={!selection}
            onPress={() =>
              Alert.alert('Changement d\'offre', 'Votre demande de changement d\'offre a été enregistrée (démo).', [
                { text: 'OK', onPress: () => router.back() },
              ])
            }
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
  card: { marginTop: spacing.sm, marginBottom: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sectionSpacing: { marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
