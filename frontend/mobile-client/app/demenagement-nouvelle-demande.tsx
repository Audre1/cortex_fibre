import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/constants/theme';
import { numeroLigneFixe } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function DemenagementNouvelleDemandeScreen() {
  const router = useRouter();
  const client = useAppStore((s) => s.client);
  const [nouvelleAdresse, setNouvelleAdresse] = useState('');

  const eligible = nouvelleAdresse.trim().length > 4;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Déménager ma Fibre" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[typography.caption as any, styles.intro]}>
            Préparez votre déménagement en vérifiant l'éligibilité de votre nouvelle adresse. La procédure est
            simple et rapide.
          </Text>

          <Card style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="wifi-outline" size={18} color={colors.primaryDark} />
              <View style={{ marginLeft: spacing.sm }}>
                <Text style={styles.rowLabel}>Ligne à transférer</Text>
                <Text style={styles.rowValue}>{numeroLigneFixe}</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={18} color={colors.primaryDark} />
              <View style={{ marginLeft: spacing.sm }}>
                <Text style={styles.rowLabel}>Adresse actuelle</Text>
                <Text style={styles.rowValue}>
                  {client.adresse.rue}, {client.adresse.ville}
                </Text>
              </View>
            </View>
          </Card>

          <TextField
            label="Nouvelle adresse"
            value={nouvelleAdresse}
            onChangeText={setNouvelleAdresse}
            placeholder="Rechercher une adresse..."
            icon="search"
          />
          <Pressable>
            <Text style={styles.geolocLink}>◎ Utiliser ma position</Text>
          </Pressable>

          {eligible && (
            <View style={{ marginTop: spacing.md }}>
              <InfoBanner
                icon="checkmark-circle"
                tone="info"
                text="Bonne nouvelle ! Votre nouvelle adresse est éligible à la fibre optique Cortex. Vous pouvez procéder au transfert."
              />
            </View>
          )}

          <View style={{ marginTop: spacing.xl }}>
            <Button
              label="Envoyer ma demande de déménagement"
              icon="arrow-forward"
              iconPosition="right"
              disabled={!eligible}
              onPress={() =>
                Alert.alert('Demande envoyée', 'Votre demande de déménagement a été enregistrée (démo).', [
                  { text: 'OK', onPress: () => router.replace('/mes-demandes') },
                ])
              }
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
  intro: { marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { fontSize: 11.5, color: colors.muted },
  rowValue: { fontSize: 14, fontWeight: '700', color: colors.ink, marginTop: 1 },
  sectionSpacing: { marginTop: spacing.md, marginBottom: spacing.sm },
  geolocLink: { color: colors.primaryDark, fontWeight: '600', fontSize: 12.5, marginTop: spacing.sm },
});
