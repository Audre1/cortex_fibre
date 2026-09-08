import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { offres } from '@/data/mockData';
import { Adresse } from '@/data/types';
import { useAppStore } from '@/store/useAppStore';

export default function CommandeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ adresse?: string; offreId?: string; telephone?: string }>();
  const client = useAppStore((s) => s.client);
  const creerDemandeInstallation = useAppStore((s) => s.creerDemandeInstallation);
  const demandeEnCours = useAppStore((s) => s.demandeEnCours);

  const adresse: Adresse = useMemo(() => {
    if (params.adresse) {
      try {
        return JSON.parse(params.adresse as string);
      } catch {
        return client.adresse;
      }
    }
    return client.adresse;
  }, [params.adresse, client.adresse]);

  const offre = useMemo(() => offres.find((o) => o.id === params.offreId) ?? offres[0], [params.offreId]);

  const [telephone, setTelephone] = useState((params.telephone as string) || client.telephone);
  const [nom, setNom] = useState(client.nom);
  const [prenom, setPrenom] = useState(client.prenom);

  const formValide = telephone.trim() && nom.trim() && prenom.trim();

  async function onConfirmer() {
    if (!formValide) return;
    await creerDemandeInstallation({ adresse, offre, telephone });
    router.replace('/demande-confirmation');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Commande" subtitle="Vérifiez vos informations avant de confirmer" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={typography.bodyBold as any}>Votre offre</Text>
          <Pressable onPress={() => router.back()}>
            <Card style={styles.offreCard}>
              <View style={styles.offreIconWrap}>
                <Ionicons name={offre.icone as any} size={20} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={typography.bodyBold as any}>{offre.nom}</Text>
                <Text style={styles.offrePrix}>
                  {offre.prixFCFA.toLocaleString('fr-FR')} FCFA / mois
                </Text>
              </View>
              <Ionicons name="pencil" size={16} color={colors.muted} />
            </Card>
          </Pressable>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color={colors.muted} />
            <Text style={styles.addressText} numberOfLines={2}>
              {adresse.numero} {adresse.rue}, {adresse.codePostal} {adresse.ville}
            </Text>
          </View>

          <Text style={[typography.bodyBold as any, styles.sectionSpacing]}>Vos coordonnées</Text>
          <TextField
            label="Numéro de téléphone"
            value={telephone}
            onChangeText={setTelephone}
            placeholder="+225 07 XX XX XX XX"
            keyboardType="phone-pad"
            icon="call-outline"
          />
          <View style={styles.rowFields}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <TextField label="Prénom" value={prenom} onChangeText={setPrenom} placeholder="Prénom" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Nom" value={nom} onChangeText={setNom} placeholder="Nom" />
            </View>
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <Button
              label="Confirmer ma commande"
              icon="checkmark"
              disabled={!formValide}
              loading={demandeEnCours}
              onPress={onConfirmer}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  offreCard: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  offreIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offrePrix: { fontSize: 13, fontWeight: '700', color: colors.primaryDark, marginTop: 2 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.xl },
  addressText: { marginLeft: spacing.xs, flex: 1, ...(typography.caption as any) },
  sectionSpacing: { marginBottom: spacing.sm },
  rowFields: { flexDirection: 'row' },
});
