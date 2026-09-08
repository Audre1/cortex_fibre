import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickAction } from '@/components/QuickAction';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function MesDemandesScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Mes demandes" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={typography.h1 as any}>Gérer mes requêtes</Text>
        <Text style={[typography.caption as any, styles.intro]}>
          Suivez vos interventions et initiez de nouvelles demandes liées à votre abonnement fibre.
        </Text>

        {dossier && dossier.statutGlobal === 'en_cours' && (
          <>
            <Text style={styles.sectionTitle}>En cours</Text>
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.rowIcon}>
                  <Ionicons name="construct-outline" size={16} color={colors.primaryDark} />
                  <Text style={typography.bodyBold as any}>Installation / dépannage</Text>
                </View>
                <Badge label="En traitement" tone="warning" />
              </View>
              <Text style={[typography.caption as any, { marginTop: spacing.sm }]}>Dossier #{dossier.numero}</Text>
              <Text style={[typography.caption as any, { marginBottom: spacing.md }]}>Mise à jour : Il y a 2 heures</Text>
              <Button label="Suivre ma demande" icon="arrow-forward" iconPosition="right" onPress={() => router.push('/(tabs)/suivi')} />
            </Card>
          </>
        )}

        <Text style={styles.sectionTitle}>Nouvelles demandes</Text>
        <View style={styles.grid}>
          <QuickAction icon="swap-horizontal" label="Changement d'offre" onPress={() => router.push('/changement-offre')} />
          <QuickAction icon="car-outline" label="Déménagement" onPress={() => router.push('/demenagement')} />
          <QuickAction icon="alert-circle-outline" label="Réclamation" onPress={() => router.push('/reclamations')} />
          <QuickAction icon="add-circle-outline" label="Nouvel abonnement" onPress={() => router.push('/eligibilite')} />
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg },
  intro: { marginTop: spacing.xs, marginBottom: spacing.xl },
  sectionTitle: { ...(typography.h3 as any), marginBottom: spacing.md },
  card: { marginBottom: spacing.xl },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowIcon: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
