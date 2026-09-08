import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { ReclamationCategorie } from '@/data/types';

const TYPES: { id: ReclamationCategorie; label: string; sous: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'connexion_ne_fonctionne_pas', label: 'Problème Internet', sous: 'Lenteur, coupure, matériel', icon: 'wifi' },
  { id: 'probleme_facture', label: 'Problème Facture', sous: 'Montant, paiement, options', icon: 'receipt-outline' },
];

export default function ReclamationScreen() {
  const router = useRouter();
  const client = useAppStore((s) => s.client);
  const creerReclamation = useAppStore((s) => s.creerReclamation);

  const [type, setType] = useState<ReclamationCategorie>('connexion_ne_fonctionne_pas');
  const [description, setDescription] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  async function onEnvoyer() {
    setEnvoiEnCours(true);
    await new Promise((r) => setTimeout(r, 700));
    const reclamation = creerReclamation(type, description.trim());
    setEnvoiEnCours(false);
    router.replace({ pathname: '/reclamation-confirmation', params: { id: reclamation.id } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Nouvelle réclamation" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Card style={styles.diagCard}>
            <View style={styles.diagRow}>
              <Ionicons name="search" size={16} color={colors.slate} />
              <Text style={styles.diagLabel}>Vérification automatique</Text>
            </View>
            <Text style={[typography.caption as any, { marginBottom: spacing.md }]}>
              Avant d'ouvrir une réclamation, nous pouvons vérifier l'état de votre ligne à distance.
            </Text>
            <Button
              label="Lancer le diagnostic"
              icon="play"
              variant="secondary"
              onPress={() => router.push('/diagnostic')}
            />
          </Card>

          <Text style={[typography.bodyBold as any, styles.sectionSpacing]}>Type de réclamation</Text>
          {TYPES.map((t) => (
            <Pressable key={t.id} style={[styles.typeRow, type === t.id && styles.typeRowActive]} onPress={() => setType(t.id)}>
              <View style={[styles.typeIconWrap, type === t.id && styles.typeIconWrapActive]}>
                <Ionicons name={t.icon} size={18} color={type === t.id ? colors.white : colors.primary} />
              </View>
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={typography.bodyBold as any}>{t.label}</Text>
                <Text style={typography.caption as any}>{t.sous}</Text>
              </View>
              <Ionicons
                name={type === t.id ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={type === t.id ? colors.primary : colors.muted}
              />
            </Pressable>
          ))}

          <Text style={[typography.bodyBold as any, styles.sectionSpacing]}>Décrivez un peu plus la situation</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Précisez..."
            placeholderTextColor={colors.muted}
            style={styles.textarea}
            multiline
          />

          <Card style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={16} color={colors.slate} />
              <Text style={styles.contactLabel}>Contact SAV</Text>
              <View style={styles.principalBadge}>
                <Text style={styles.principalBadgeText}>Principal</Text>
              </View>
            </View>
            <Text style={styles.contactValue}>{client.telephone}</Text>
            <Pressable>
              <Text style={styles.addContactLink}>+ Ajouter contact alternatif</Text>
            </Pressable>
          </Card>

          <View style={{ marginTop: spacing.lg }}>
            <Button label="Envoyer ma réclamation" icon="send" loading={envoiEnCours} onPress={onEnvoyer} />
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
  diagCard: { backgroundColor: colors.background, marginBottom: spacing.lg },
  diagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  diagLabel: { marginLeft: spacing.xs, fontWeight: '700', fontSize: 13.5 },
  sectionSpacing: { marginTop: spacing.md, marginBottom: spacing.sm },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  typeRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  typeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconWrapActive: { backgroundColor: colors.primary },
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
  contactCard: { marginTop: spacing.lg },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactLabel: { marginLeft: spacing.xs, fontWeight: '700', fontSize: 13 },
  principalBadge: { marginLeft: 'auto', backgroundColor: colors.primarySoft, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  principalBadgeText: { fontSize: 10.5, fontWeight: '700', color: colors.primaryDark },
  contactValue: { fontSize: 15, fontWeight: '700', marginTop: spacing.sm },
  addContactLink: { marginTop: spacing.sm, color: colors.primaryDark, fontSize: 12.5, fontWeight: '600' },
});
