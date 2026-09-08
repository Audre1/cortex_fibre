import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function DemandeConfirmationScreen() {
  const router = useRouter();
  const client = useAppStore((s) => s.client);
  const dossier = useAppStore((s) => s.dossier);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={typography.h3 as any}>Confirmation</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={36} color={colors.white} />
        </View>
        <Text style={[typography.h1 as any, styles.title]}>Félicitations {client.prenom} !</Text>
        <Text style={[typography.body as any, styles.subtitle]}>
          Votre demande Fibre a bien été enregistrée.
        </Text>
        <Text style={[typography.caption as any, styles.subtitle2]}>
          Votre commande a été prise en compte. Vous pourrez suivre les prochaines étapes de votre installation
          directement depuis CORTEX FIBER.
        </Text>

        {dossier && (
          <Card style={styles.card}>
            <Text style={typography.bodyBold as any}>Votre demande</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Offre</Text>
              <Text style={styles.rowValue}>{dossier.offre?.nom ?? '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Prix</Text>
              <Text style={styles.rowValue}>
                {dossier.offre ? `${dossier.offre.prixFCFA.toLocaleString('fr-FR')} FCFA / mois` : '—'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Statut</Text>
              <View style={styles.statutRow}>
                <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                <Text style={styles.statutText}>Demande enregistrée</Text>
              </View>
            </View>
          </Card>
        )}
      </View>

      <View style={styles.actions}>
        <Button label="Suivre ma demande →" onPress={() => router.replace('/(tabs)/suivi')} />
        <View style={{ marginTop: spacing.sm }}>
          <Button label="Retour à l'accueil" variant="ghost" onPress={() => router.replace('/(tabs)')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  header: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.sm },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.sm, fontWeight: '600' },
  subtitle2: { textAlign: 'center', marginTop: spacing.sm },
  card: { marginTop: spacing.xl, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  rowLabel: { color: colors.muted, fontSize: 13.5 },
  rowValue: { fontWeight: '700', color: colors.ink, fontSize: 13.5 },
  statutRow: { flexDirection: 'row', alignItems: 'center' },
  statutText: { marginLeft: 4, fontWeight: '700', color: colors.success, fontSize: 13.5 },
  actions: { padding: spacing.lg },
});
