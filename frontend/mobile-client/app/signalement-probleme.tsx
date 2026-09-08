import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { descriptionsCategorieReclamation, libellesCategorieReclamation } from '@/data/mockData';
import { ReclamationCategorie } from '@/data/types';
import { useAppStore } from '@/store/useAppStore';

const MOTIFS: ReclamationCategorie[] = [
  'connexion_ne_fonctionne_pas',
  'installation_non_realisee',
  'installation_incomplete',
  'autre',
];

export default function SignalementProblemeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ motif?: string }>();
  const dossier = useAppStore((s) => s.dossier);
  const creerReclamation = useAppStore((s) => s.creerReclamation);

  const [motif, setMotif] = useState<ReclamationCategorie>((params.motif as ReclamationCategorie) || 'connexion_ne_fonctionne_pas');
  const [description, setDescription] = useState('');
  const [confirme, setConfirme] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  async function onEnvoyer() {
    if (!confirme) return;
    setEnvoiEnCours(true);
    await new Promise((r) => setTimeout(r, 700));
    const reclamation = creerReclamation(motif, description.trim());
    setEnvoiEnCours(false);
    router.replace({ pathname: '/reclamation-confirmation', params: { id: reclamation.id } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Signaler un problème" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {dossier && (
            <Card style={styles.warnCard}>
              <Text style={styles.warnText}>
                Votre dossier ne sera pas clôturé automatiquement pendant la vérification de votre signalement.
              </Text>
            </Card>
          )}

          <Text style={typography.bodyBold as any}>Que s'est-il passé ?</Text>
          <View style={{ marginTop: spacing.sm }}>
            {MOTIFS.map((m) => (
              <Pressable key={m} style={[styles.optionRow, motif === m && styles.optionRowActive]} onPress={() => setMotif(m)}>
                <Ionicons
                  name={motif === m ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={motif === m ? colors.primary : colors.muted}
                />
                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                  <Text style={typography.bodyBold as any}>{libellesCategorieReclamation[m]}</Text>
                  <Text style={typography.caption as any}>{descriptionsCategorieReclamation[m]}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Text style={[typography.bodyBold as any, styles.sectionSpacing]}>Description (optionnel)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez le problème rencontré..."
            placeholderTextColor={colors.muted}
            style={styles.textarea}
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>

          <Text style={[typography.bodyBold as any, styles.sectionSpacing]}>Pièces jointes</Text>
          <View style={styles.attachRow}>
            <View style={styles.attachButton}>
              <Ionicons name="camera-outline" size={18} color={colors.slate} />
              <Text style={styles.attachText}>Ajouter une photo</Text>
            </View>
            <View style={styles.attachButton}>
              <Ionicons name="document-attach-outline" size={18} color={colors.slate} />
              <Text style={styles.attachText}>Ajouter un document</Text>
            </View>
          </View>

          {dossier && (
            <Card style={styles.recapCard}>
              <Text style={styles.cardLabel}>RÉCAPITULATIF DE L'INTERVENTION</Text>
              <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Date</Text>
                <Text style={styles.recapValue}>{dossier.rdv?.date ?? 'Aujourd\'hui'}</Text>
              </View>
              <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Technicien</Text>
                <Text style={styles.recapValue}>
                  {dossier.technicien ? `${dossier.technicien.prenom} ${dossier.technicien.nom}` : '—'}
                </Text>
              </View>
              <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Type</Text>
                <Text style={styles.recapValue}>Raccordement Initial</Text>
              </View>
            </Card>
          )}

          <Pressable style={styles.confirmRow} onPress={() => setConfirme((v) => !v)}>
            <Ionicons name={confirme ? 'checkbox' : 'square-outline'} size={20} color={confirme ? colors.primary : colors.muted} />
            <Text style={styles.confirmText}>
              Je confirme que les informations fournies sont exactes et je demande l'ouverture d'une investigation
              technique.
            </Text>
          </Pressable>

          <View style={{ marginTop: spacing.lg }}>
            <Button
              label="Envoyer mon signalement"
              icon="send"
              disabled={!confirme}
              loading={envoiEnCours}
              onPress={onEnvoyer}
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
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  warnCard: { backgroundColor: colors.warningSoft, borderColor: colors.warningSoft, marginBottom: spacing.lg },
  warnText: { fontSize: 12.5, color: colors.warning, fontWeight: '600' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  optionRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  sectionSpacing: { marginTop: spacing.lg, marginBottom: spacing.sm },
  textarea: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 90,
    fontSize: 14,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  charCount: { textAlign: 'right', fontSize: 11, color: colors.muted, marginTop: 4 },
  attachRow: { flexDirection: 'row', gap: spacing.sm },
  attachButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  attachText: { marginLeft: spacing.xs, fontSize: 12.5, fontWeight: '600', color: colors.slate },
  recapCard: { marginTop: spacing.lg },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: spacing.sm },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  recapLabel: { fontSize: 13, color: colors.muted },
  recapValue: { fontSize: 13, fontWeight: '600', color: colors.ink },
  confirmRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.lg },
  confirmText: { marginLeft: spacing.sm, flex: 1, fontSize: 12.5, color: colors.slate, lineHeight: 17 },
});
