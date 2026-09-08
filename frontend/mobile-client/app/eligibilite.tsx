import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EligibiliteMap } from '@/components/EligibiliteMap';
import { OfferCard } from '@/components/OfferCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { offres } from '@/data/mockData';
import { Adresse, Offre } from '@/data/types';
import { useAppStore } from '@/store/useAppStore';

const RESULTAT_CONFIG = {
  eligible: {
    icon: 'checkmark-circle' as const,
    color: colors.success,
    bg: colors.successSoft,
    titre: 'Bonne nouvelle !',
    soustitre: 'Votre adresse est éligible à la Fibre. Choisissez maintenant l\'offre qui correspond à vos besoins.',
  },
  zone_a_etudier: {
    icon: 'time' as const,
    color: colors.warning,
    bg: colors.warningSoft,
    titre: 'Votre zone est en cours de déploiement',
    soustitre: '',
  },
  non_eligible: {
    icon: 'close-circle' as const,
    color: colors.danger,
    bg: colors.dangerSoft,
    titre: 'Non éligible pour le moment',
    soustitre: '',
  },
};

export default function EligibiliteScreen() {
  const router = useRouter();
  const client = useAppStore((s) => s.client);
  const eligibiliteResult = useAppStore((s) => s.eligibiliteResult);
  const eligibiliteLoading = useAppStore((s) => s.eligibiliteLoading);
  const verifierEligibilite = useAppStore((s) => s.verifierEligibilite);
  const reinitialiserEligibilite = useAppStore((s) => s.reinitialiserEligibilite);

  const [telephone, setTelephone] = useState(client.telephone);
  const [adresse, setAdresse] = useState<Adresse>(client.adresse);
  const [modeManuel, setModeManuel] = useState(false);
  const [offreChoisie, setOffreChoisie] = useState<Offre | null>(null);

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [localisationEnCours, setLocalisationEnCours] = useState(true);
  const [localisationRefusee, setLocalisationRefusee] = useState(false);

  useEffect(() => {
    let annule = false;

    async function localiser() {
      setLocalisationEnCours(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!annule) {
            setLocalisationRefusee(true);
            setLocalisationEnCours(false);
            setModeManuel(true);
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        if (annule) return;
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });

        const [lieu] = await Location.reverseGeocodeAsync(position.coords);
        if (!annule && lieu) {
          setAdresse((a) => ({
            numero: lieu.streetNumber ?? a.numero,
            rue: lieu.street ?? a.rue,
            codePostal: lieu.postalCode ?? a.codePostal,
            ville: lieu.city ?? lieu.region ?? a.ville,
          }));
        }
      } catch {
        if (!annule) {
          setLocalisationRefusee(true);
          setModeManuel(true);
        }
      } finally {
        if (!annule) setLocalisationEnCours(false);
      }
    }

    localiser();
    return () => {
      annule = true;
    };
  }, []);

  const adresseTexte = `${adresse.numero} ${adresse.rue}, ${adresse.ville}`;
  const formValide = adresse.numero.trim() && adresse.rue.trim() && adresse.codePostal.trim() && adresse.ville.trim();

  async function onVerifier() {
    if (!formValide) return;
    await verifierEligibilite(adresse);
  }

  function onContinuerVersCommande() {
    if (!offreChoisie) return;
    router.push({
      pathname: '/commande',
      params: { adresse: JSON.stringify(adresse), offreId: offreChoisie.id, telephone },
    });
  }

  const config = eligibiliteResult ? RESULTAT_CONFIG[eligibiliteResult.statut] : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Éligibilité fibre" showBack={!eligibiliteResult} onBack={() => router.back()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {!eligibiliteResult && !eligibiliteLoading && (
            <>
              <EligibiliteMap coords={coords} loading={localisationEnCours} height={MAP_H} />

              <View style={styles.sheet}>
                <Text style={typography.h3 as any}>Test d'éligibilité</Text>
                <Text style={[typography.caption as any, styles.intro]}>
                  Vérifiez si la Fibre est disponible à votre adresse.
                </Text>

                {localisationEnCours && (
                  <View style={styles.locStatus}>
                    <Ionicons name="navigate" size={14} color={colors.info} />
                    <Text style={styles.locStatusText}>Localisation en cours...</Text>
                  </View>
                )}
                {!localisationEnCours && coords && !modeManuel && (
                  <View style={styles.locStatus}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                    <Text style={[styles.locStatusText, { color: colors.success }]}>
                      Position détectée, adresse pré-remplie
                    </Text>
                  </View>
                )}
                {localisationRefusee && (
                  <View style={styles.locStatus}>
                    <Ionicons name="information-circle" size={14} color={colors.muted} />
                    <Text style={styles.locStatusText}>
                      Localisation indisponible — indiquez votre adresse manuellement
                    </Text>
                  </View>
                )}

                <TextField
                  label="Numéro de téléphone"
                  value={telephone}
                  onChangeText={setTelephone}
                  placeholder="07 XX XX XX XX"
                  keyboardType="phone-pad"
                  icon="call-outline"
                />

                {!modeManuel ? (
                  <Pressable onPress={() => setModeManuel(true)}>
                    <View style={styles.addressPreview}>
                      <Ionicons name="home-outline" size={18} color={colors.primaryDark} />
                      <Text style={styles.addressPreviewText} numberOfLines={2}>
                        {adresseTexte}
                      </Text>
                      <Ionicons name="create-outline" size={16} color={colors.muted} />
                    </View>
                  </Pressable>
                ) : (
                  <>
                    <View style={styles.rowFields}>
                      <View style={{ flex: 1, marginRight: spacing.sm }}>
                        <TextField
                          label="N°"
                          value={adresse.numero}
                          onChangeText={(v) => setAdresse((a) => ({ ...a, numero: v }))}
                          placeholder="12"
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={{ flex: 3 }}>
                        <TextField
                          label="Rue"
                          value={adresse.rue}
                          onChangeText={(v) => setAdresse((a) => ({ ...a, rue: v }))}
                          placeholder="Rue des Jardins"
                        />
                      </View>
                    </View>
                    <View style={styles.rowFields}>
                      <View style={{ flex: 1, marginRight: spacing.sm }}>
                        <TextField
                          label="Code postal"
                          value={adresse.codePostal}
                          onChangeText={(v) => setAdresse((a) => ({ ...a, codePostal: v }))}
                          placeholder="75011"
                          keyboardType="number-pad"
                          maxLength={5}
                        />
                      </View>
                      <View style={{ flex: 1.4 }}>
                        <TextField
                          label="Ville"
                          value={adresse.ville}
                          onChangeText={(v) => setAdresse((a) => ({ ...a, ville: v }))}
                          placeholder="Abidjan"
                        />
                      </View>
                    </View>
                  </>
                )}

                <View style={{ marginTop: spacing.sm }}>
                  <Button label="Vérifier mon éligibilité" icon="search" onPress={onVerifier} disabled={!formValide} />
                </View>
                {!modeManuel && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Button label="Indiquer mon adresse manuellement" variant="ghost" onPress={() => setModeManuel(true)} />
                  </View>
                )}
              </View>
            </>
          )}

          {eligibiliteLoading && (
            <View style={styles.loadingWrap}>
              <View style={styles.loadingSpinner}>
                <Ionicons name="wifi" size={30} color={colors.primary} />
              </View>
              <Text style={[typography.h3 as any, { marginTop: spacing.lg, textAlign: 'center' }]}>
                Vérification en cours...
              </Text>
              <Text style={[typography.caption as any, { textAlign: 'center', marginTop: spacing.xs }]}>
                Nous consultons notre réseau fibre pour votre adresse.
              </Text>
            </View>
          )}

          {config && eligibiliteResult && !eligibiliteLoading && (
            <View style={styles.resultWrap}>
              <View style={[styles.resultIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={40} color={config.color} />
              </View>
              <Text style={[typography.h2 as any, styles.resultTitle]}>{config.titre}</Text>
              {!!config.soustitre && (
                <Text style={[typography.body as any, styles.resultSubtitle]}>{config.soustitre}</Text>
              )}

              <Card style={styles.addressCard}>
                <View style={styles.addressCardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addressCardLabel}>ADRESSE TESTÉE</Text>
                    <Text style={typography.bodyBold as any}>
                      {eligibiliteResult.adresse.numero} {eligibiliteResult.adresse.rue}, {eligibiliteResult.adresse.ville}
                    </Text>
                  </View>
                  <Pressable onPress={reinitialiserEligibilite}>
                    <Text style={styles.modifierLink}>Modifier</Text>
                  </Pressable>
                </View>
              </Card>

              {eligibiliteResult.statut === 'eligible' && (
                <View style={styles.offresSection}>
                  <Text style={[typography.h3 as any, styles.offresTitle]}>Choisissez votre offre Fibre</Text>
                  <Text style={[typography.caption as any, { marginBottom: spacing.md }]}>
                    Toutes les offres disponibles à votre adresse.
                  </Text>
                  <View style={styles.offresGrid}>
                    {offres.map((o) => (
                      <OfferCard key={o.id} offre={o} selected={offreChoisie?.id === o.id} onPress={() => setOffreChoisie(o)} />
                    ))}
                  </View>
                  <View style={{ marginTop: spacing.sm, width: '100%' }}>
                    <Button
                      label="Continuer"
                      icon="arrow-forward"
                      iconPosition="right"
                      disabled={!offreChoisie}
                      onPress={onContinuerVersCommande}
                    />
                  </View>
                </View>
              )}

              {eligibiliteResult.statut === 'zone_a_etudier' && (
                <Card style={styles.resultCard}>
                  <Text style={typography.body as any}>
                    Votre zone fait partie d'un déploiement prévu.{' '}
                    {eligibiliteResult.dateDisponibilitePrevue}. Nous vous notifierons dès que la fibre sera
                    disponible.
                  </Text>
                </Card>
              )}
              {eligibiliteResult.statut === 'non_eligible' && (
                <Card style={styles.resultCard}>
                  <Text style={typography.body as any}>
                    La fibre n'est pas encore disponible à cette adresse. Un conseiller Cortex peut vous proposer
                    une alternative.
                  </Text>
                </Card>
              )}

              {eligibiliteResult.statut !== 'eligible' && (
                <View style={{ marginTop: spacing.lg, width: '100%' }}>
                  <Button label="Vérifier une autre adresse" variant="ghost" onPress={reinitialiserEligibilite} />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const MAP_H = 170;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: spacing.xxl },
  locStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  locStatusText: { marginLeft: spacing.xs, fontSize: 12, color: colors.info, fontWeight: '600' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    padding: spacing.lg,
  },
  intro: { marginBottom: spacing.lg },
  rowFields: { flexDirection: 'row' },
  addressPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  addressPreviewText: { flex: 1, marginHorizontal: spacing.sm, ...(typography.body as any) },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl * 2, paddingHorizontal: spacing.xl },
  loadingSpinner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWrap: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.lg },
  resultIcon: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { textAlign: 'center', marginTop: spacing.lg },
  resultSubtitle: { textAlign: 'center', color: colors.slate, marginTop: spacing.xs },
  addressCard: { marginTop: spacing.lg, width: '100%' },
  addressCardRow: { flexDirection: 'row', alignItems: 'center' },
  addressCardLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, marginBottom: 3, letterSpacing: 0.5 },
  modifierLink: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  offresSection: { width: '100%', marginTop: spacing.xl },
  offresTitle: { marginBottom: 2 },
  offresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  resultCard: { marginTop: spacing.lg, width: '100%' },
});
