import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

type Reponse = 'oui' | 'non' | 'incertain';

const VERIFICATIONS = [
  { label: 'Alimentation électrique vérifiée', ok: true },
  { label: 'Câble optique branché', ok: true },
  { label: 'État des voyants', ok: null as boolean | null },
];

export default function DiagnosticScreen() {
  const router = useRouter();
  const dossier = useAppStore((s) => s.dossier);
  const [reponse, setReponse] = useState<Reponse | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Diagnostic de connexion" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {dossier && (
          <>
            <Text style={typography.caption as any}>Dossier {dossier.numero} · Étape 1 sur 4</Text>
            <View style={styles.progressRow}>
              <View style={[styles.progressBar, styles.progressBarFilled]} />
              <View style={styles.progressBar} />
              <View style={styles.progressBar} />
              <View style={styles.progressBar} />
            </View>
          </>
        )}

        <Card style={styles.card}>
          <View style={styles.rowIconTitle}>
            <Ionicons name="git-network-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.cardTitle}>État de la ligne</Text>
          </View>
          <Text style={typography.caption as any}>
            Données de démonstration : Ligne active, signal optique détecté au PM.
          </Text>
        </Card>

        <Text style={[typography.h3 as any, styles.question]}>Votre box est-elle allumée ?</Text>
        <View style={styles.plugBox}>
          <Ionicons name="flash-outline" size={30} color={colors.muted} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Button label="Oui" variant={reponse === 'oui' ? 'primary' : 'ghost'} onPress={() => setReponse('oui')} />
          <Button label="Non" variant={reponse === 'non' ? 'primary' : 'ghost'} onPress={() => setReponse('non')} />
          <Button
            label="Je ne sais pas"
            variant={reponse === 'incertain' ? 'primary' : 'ghost'}
            onPress={() => setReponse('incertain')}
          />
        </View>

        {!reponse && (
          <Pressable style={styles.skipLink} onPress={() => setReponse('incertain')}>
            <Text style={styles.skipLinkText}>Passer cette étape</Text>
          </Pressable>
        )}

        {reponse && (
          <>
            <Text style={[typography.h3 as any, styles.sectionTitle]}>Récapitulatif des vérifications</Text>
            <Card>
              {VERIFICATIONS.map((v) => (
                <View key={v.label} style={styles.verifRow}>
                  <Ionicons
                    name={v.ok === true ? 'checkmark-circle' : v.ok === false ? 'close-circle' : 'help-circle'}
                    size={16}
                    color={v.ok === true ? colors.success : v.ok === false ? colors.danger : colors.muted}
                  />
                  <Text style={styles.verifText}>{v.label}</Text>
                </View>
              ))}

              <View style={styles.resultBlock}>
                <Text style={styles.resultLabel}>Résultat probable :</Text>
                <Text style={typography.body as any}>
                  Problème de synchronisation réseau détecté. Une intervention au niveau de l'armoire (PM)
                  pourrait être nécessaire.
                </Text>
              </View>
            </Card>

            <View style={{ marginTop: spacing.lg }}>
              <Button
                label="Le problème continue"
                icon="alert-circle-outline"
                onPress={() => router.replace({ pathname: '/signalement-probleme', params: { motif: 'connexion_ne_fonctionne_pas' } })}
              />
              <View style={{ marginTop: spacing.sm }}>
                <Button
                  label="Ma connexion fonctionne"
                  variant="ghost"
                  icon="checkmark"
                  onPress={() => router.back()}
                />
              </View>
              <Pressable
                style={styles.skipLink}
                onPress={() => Alert.alert('Conseiller', 'Un conseiller Orange va vous contacter (démo).')}
              >
                <Text style={styles.skipLinkText}>Parler à un conseiller</Text>
              </Pressable>
            </View>
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  progressRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm, marginBottom: spacing.lg },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  progressBarFilled: { backgroundColor: colors.primary },
  card: { marginBottom: spacing.xl },
  rowIconTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  cardTitle: { marginLeft: spacing.xs, fontWeight: '700', fontSize: 14 },
  question: { marginBottom: spacing.md },
  plugBox: {
    height: 90,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  skipLink: { alignItems: 'center', marginTop: spacing.md },
  skipLinkText: { color: colors.primaryDark, fontWeight: '600', fontSize: 13 },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  verifRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  verifText: { marginLeft: spacing.sm, fontSize: 13.5, color: colors.ink },
  resultBlock: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  resultLabel: { fontWeight: '700', marginBottom: 4, fontSize: 13.5 },
});
