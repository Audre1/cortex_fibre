import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function GererWifiScreen() {
  const wifi = useAppStore((s) => s.wifi);
  const toggleAppareilWifi = useAppStore((s) => s.toggleAppareilWifi);
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Gérer mon WiFi" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[typography.caption as any, { marginBottom: spacing.lg }]}>
          Consultez et modifiez les paramètres de votre réseau WiFi principal.
        </Text>

        <Card style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={typography.bodyBold as any}>État du WiFi</Text>
            <View style={styles.etatBadge}>
              <View style={styles.etatDot} />
              <Text style={styles.etatText}>Actif</Text>
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Nom du réseau</Text>
            <Text style={styles.fieldValue}>{wifi.nomReseau}</Text>
          </View>
          <Pressable onPress={() => Alert.alert('Modifier', 'Renommer le réseau WiFi (démo).')}>
            <Text style={styles.editLink}>Modifier le nom du WiFi</Text>
          </Pressable>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Sécurité</Text>
            <Text style={styles.fieldValue}>Protégé (WPA3)</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={typography.bodyBold as any}>Mot de passe</Text>
          <View style={styles.passwordRow}>
            <Text style={styles.passwordText}>{motDePasseVisible ? wifi.motDePasse : '•'.repeat(wifi.motDePasse.length)}</Text>
            <Pressable onPress={() => setMotDePasseVisible((v) => !v)} hitSlop={8}>
              <Ionicons name={motDePasseVisible ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.slate} />
            </Pressable>
          </View>
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Modifier le mot de passe"
              variant="ghost"
              onPress={() => Alert.alert('Mot de passe', 'Changement du mot de passe WiFi (démo).')}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={typography.bodyBold as any}>Partager mon WiFi</Text>
          <View style={styles.qrWrap}>
            <Ionicons name="qr-code-outline" size={90} color={colors.ink} />
          </View>
          <Text style={[typography.caption as any, styles.qrCaption]}>
            Faites scanner ce code pour connecter un invité sans saisir le mot de passe.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Appareils connectés ({wifi.appareilsConnectes.length})</Text>
        <Card padded={false}>
          {wifi.appareilsConnectes.map((a, i) => (
            <View key={a.id}>
              <View style={styles.appareilRow}>
                <Ionicons name="hardware-chip-outline" size={18} color={colors.primaryDark} />
                <Text style={styles.appareilNom}>{a.nom}</Text>
                <Switch
                  value={a.actif}
                  onValueChange={() => toggleAppareilWifi(a.id)}
                  trackColor={{ true: colors.primary, false: colors.border }}
                  thumbColor={colors.white}
                />
              </View>
              {i < wifi.appareilsConnectes.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        <Pressable style={styles.restartLink} onPress={() => Alert.alert('Box', 'Redémarrage de la box en cours (démo).')}>
          <Text style={styles.restartLinkText}>↻ Redémarrer ma box</Text>
        </Pressable>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg },
  card: { marginBottom: spacing.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  etatBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  etatDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 4 },
  etatText: { fontSize: 11, fontWeight: '700', color: colors.success },
  fieldRow: { marginTop: spacing.md },
  fieldLabel: { fontSize: 12, color: colors.muted },
  fieldValue: { fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 2 },
  editLink: { color: colors.primaryDark, fontWeight: '600', fontSize: 12.5, marginTop: spacing.xs },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  passwordText: { fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  qrWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg },
  qrCaption: { textAlign: 'center' },
  sectionTitle: { ...(typography.h3 as any), marginBottom: spacing.md },
  appareilRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  appareilNom: { flex: 1, marginLeft: spacing.sm, fontSize: 14, fontWeight: '600', color: colors.ink },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
  restartLink: { alignItems: 'center', marginTop: spacing.lg },
  restartLinkText: { color: colors.slate, fontWeight: '600', fontSize: 13 },
});
