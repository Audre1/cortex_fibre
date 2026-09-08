import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StepperHorizontal } from '@/components/StepperHorizontal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function SuiviScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);
  const [historiqueOuvert, setHistoriqueOuvert] = useState(false);

  const etapeEnCours = dossier?.etapes.find((e) => e.statut === 'en_cours');
  const technicienAssigneOuPlus =
    dossier?.etapes.find((e) => e.id === 'technicien_assigne')?.statut === 'fait';
  const estFibreActive = dossier?.statutGlobal === 'termine';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={typography.h1 as any}>Suivi</Text>
        <Pressable onPress={() => router.push('/notifications')} hitSlop={10}>
          <Ionicons name="notifications-outline" size={22} color={colors.ink} />
        </Pressable>
      </View>

      {!dossier ? (
        <View style={styles.empty}>
          <Ionicons name="folder-open-outline" size={48} color={colors.muted} />
          <Text style={[typography.h3 as any, { marginTop: spacing.md, textAlign: 'center' }]}>
            Aucun dossier pour le moment
          </Text>
          <Text style={[typography.caption as any, { textAlign: 'center', marginTop: spacing.xs }]}>
            Vérifiez votre éligibilité pour démarrer une demande d'installation.
          </Text>
          <View style={{ marginTop: spacing.lg, width: '100%' }}>
            <Button label="Vérifier mon éligibilité" icon="wifi" onPress={() => router.push('/eligibilite')} />
          </View>
        </View>
      ) : estFibreActive ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.successWrap}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={34} color={colors.white} />
            </View>
            <Text style={[typography.h2 as any, styles.successTitle]}>Votre fibre est active</Text>
            <Text style={[typography.body as any, styles.successSubtitle]}>
              Merci, votre confirmation a bien été enregistrée. Vous pouvez désormais profiter pleinement de vos
              services.
            </Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.statutHeaderRow}>
              <View>
                <Text style={styles.labelSmall}>STATUT DU DOSSIER {dossier.numero}</Text>
                <Text style={typography.h3 as any}>Fibre active</Text>
              </View>
              <Badge label="actif" tone="info" />
            </View>
            {dossier.dateActivation && (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={15} color={colors.muted} />
                <Text style={styles.metaText}>Date d'activation : {dossier.dateActivation}</Text>
              </View>
            )}
          </Card>

          <Pressable onPress={() => setHistoriqueOuvert((v) => !v)}>
            <View style={styles.historiqueLink}>
              <Text style={styles.historiqueLinkText}>Historique d'installation</Text>
              <Ionicons name={historiqueOuvert ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primaryDark} />
            </View>
          </Pressable>
          {historiqueOuvert && (
            <Card style={{ marginTop: spacing.sm }}>
              <StepperHorizontal etapes={dossier.etapes} />
            </Card>
          )}

          <View style={{ marginTop: spacing.xl }}>
            <Button
              label="Voir reçu"
              icon="receipt-outline"
              onPress={() => Alert.alert('Reçu', 'Votre reçu vous a été envoyé par SMS et email.')}
            />
            <View style={{ marginTop: spacing.sm }}>
              <Button label="Espace fibre" variant="ghost" onPress={() => router.push('/(tabs)')} />
            </View>
          </View>

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {dossier.rdv && !technicienAssigneOuPlus && (
            <View style={styles.rdvBanner}>
              <Text style={styles.rdvBannerText}>RDV Prévu le {dossier.rdv.date}</Text>
            </View>
          )}
          {etapeEnCours?.id === 'installation' && (
            <View style={styles.techBanner}>
              <View style={styles.techBannerRow}>
                <Ionicons name="time" size={16} color={colors.white} />
                <Text style={styles.techBannerTitle}>Technicien en cours</Text>
              </View>
              <Text style={styles.techBannerSub}>
                Arrivée estimée : {dossier.technicien?.heureArriveeEstimee ?? '—'}
              </Text>
            </View>
          )}

          {etapeEnCours?.id === 'installation' && (
            <View style={{ marginBottom: spacing.md }}>
              <InfoBanner
                icon="alert-circle"
                tone="warning"
                text="Veuillez vous assurer d'être présent à l'adresse indiquée."
              />
            </View>
          )}

          <Card style={styles.card}>
            <Text style={styles.labelSmall}>N° DE DOSSIER</Text>
            <View style={styles.numeroRow}>
              <Text style={typography.h3 as any}>{dossier.numero}</Text>
              {technicienAssigneOuPlus && <Badge label="Demande validée" tone="warning" />}
              {!technicienAssigneOuPlus && dossier.rdv && <Badge label="Dossier validé" tone="warning" />}
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={15} color={colors.muted} />
              <Text style={styles.metaText}>
                {dossier.adresse.rue}, {dossier.adresse.ville}
              </Text>
            </View>
            <Text style={[typography.caption as any, styles.forfaitLabel]}>Forfait</Text>
            <Text style={styles.forfaitNom}>{dossier.offre?.nom}</Text>
            <Text style={styles.forfaitPrix}>{dossier.offre?.prixFCFA.toLocaleString('fr-FR')} FCFA / mois</Text>
          </Card>

          {dossier.interventionAConfirmer ? (
            <View style={{ marginBottom: spacing.lg }}>
              <Button
                label="Confirmer la fin de l'intervention"
                icon="checkmark-circle"
                onPress={() => router.push('/intervention-confirmation')}
              />
            </View>
          ) : (
            <Card style={styles.card}>
              <View style={styles.prochaineActionHeader}>
                <Ionicons name="calendar" size={16} color={colors.primaryDark} />
                <Text style={styles.prochaineActionLabel}>PROCHAINE ACTION</Text>
              </View>
              <Text style={[typography.body as any, { marginBottom: spacing.md }]}>
                {etapeEnCours?.id === 'installation'
                  ? 'Votre technicien est en route pour l\'installation.'
                  : 'Orange va vous assigner un technicien dans pas longtemps.'}
              </Text>
              <Button
                label="Contactez technicien"
                icon={technicienAssigneOuPlus ? 'arrow-forward' : 'lock-closed'}
                iconPosition="right"
                disabled={!technicienAssigneOuPlus}
                onPress={() => dossier.technicien && router.push(`/chat/${dossier.technicien.id}`)}
              />
            </Card>
          )}

          <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>Suivi de l'installation</Text>
          <Card>
            <StepperHorizontal etapes={dossier.etapes} />
          </Card>

          <View style={{ marginTop: spacing.xl }}>
            <Button
              label="Faire une réclamation"
              variant="ghost"
              icon="alert-circle-outline"
              onPress={() => router.push('/reclamation')}
            />
          </View>

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  scroll: { paddingHorizontal: spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  card: { marginBottom: spacing.lg },
  labelSmall: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5 },
  numeroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  metaText: { marginLeft: spacing.xs, fontSize: 13, color: colors.slate },
  forfaitLabel: { marginTop: spacing.md, marginBottom: 2 },
  forfaitNom: { fontWeight: '700', color: colors.primaryDark, fontSize: 14 },
  forfaitPrix: { fontSize: 12.5, color: colors.slate, marginTop: 2 },
  rdvBanner: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  rdvBannerText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  techBanner: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  techBannerRow: { flexDirection: 'row', alignItems: 'center' },
  techBannerTitle: { color: colors.white, fontWeight: '700', fontSize: 14, marginLeft: spacing.xs },
  techBannerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, marginTop: 4, marginLeft: 22 },
  prochaineActionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  prochaineActionLabel: { fontSize: 11, fontWeight: '700', color: colors.primaryDark, marginLeft: spacing.xs, letterSpacing: 0.5 },
  sectionTitle: { ...(typography.h3 as any), marginBottom: spacing.md },
  successWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: { textAlign: 'center' },
  successSubtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.sm },
  statutHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  historiqueLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  historiqueLinkText: { fontWeight: '700', color: colors.ink, fontSize: 15 },
});
