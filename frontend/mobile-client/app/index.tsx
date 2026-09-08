import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { colors, radius, spacing, typography } from '@/constants/theme';

type Mode = 'connexion' | 'inscription';

export default function WelcomeScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('connexion');

  const [login, setLogin] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');

  const connexionValide = login.trim().length > 0;
  const inscriptionValide = prenom.trim() && nom.trim() && telephone.trim();

  function onContinuer() {
    if (mode === 'connexion') {
      router.replace('/(tabs)');
    } else {
      // Nouveau client : direction naturelle, on vérifie l'éligibilité.
      router.push('/eligibilite');
    }
  }

  return (
    <View style={styles.flex}>
      <ImageBackground source={require('../assets/images/welcome-bg.jpg')} style={styles.bgImage} resizeMode="cover">
        <LinearGradient
          colors={['rgba(20,23,26,0.55)', 'rgba(214,95,0,0.55)', colors.primary]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.top} />

          <View style={styles.card}>
            <Text style={[typography.h2 as any, styles.title]}>Bienvenue sur{'\n'}CORTEX FIBER</Text>
            <Text style={[typography.caption as any, styles.subtitle]}>
              Gérez simplement votre Fibre et suivez vos services depuis un seul espace.
            </Text>

            <View style={styles.tabs}>
              <Pressable style={[styles.tab, mode === 'connexion' && styles.tabActive]} onPress={() => setMode('connexion')}>
                <Text style={[styles.tabText, mode === 'connexion' && styles.tabTextActive]}>Connexion</Text>
              </Pressable>
              <Pressable style={[styles.tab, mode === 'inscription' && styles.tabActive]} onPress={() => setMode('inscription')}>
                <Text style={[styles.tabText, mode === 'inscription' && styles.tabTextActive]}>Inscription</Text>
              </Pressable>
            </View>

            {mode === 'connexion' ? (
              <View style={{ marginTop: spacing.lg }}>
                <TextField
                  label="N° de téléphone fixe ou login fibre"
                  value={login}
                  onChangeText={setLogin}
                  placeholder="07 XX XX XX XX"
                  keyboardType="phone-pad"
                  icon="person-outline"
                />
              </View>
            ) : (
              <View style={{ marginTop: spacing.lg }}>
                <View style={styles.rowFields}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <TextField label="Prénom" value={prenom} onChangeText={setPrenom} placeholder="Prénom" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField label="Nom" value={nom} onChangeText={setNom} placeholder="Nom" />
                  </View>
                </View>
                <TextField
                  label="Numéro de téléphone"
                  value={telephone}
                  onChangeText={setTelephone}
                  placeholder="07 XX XX XX XX"
                  keyboardType="phone-pad"
                  icon="call-outline"
                />
              </View>
            )}

            <Button
              label="Continuer"
              icon="arrow-forward"
              iconPosition="right"
              disabled={mode === 'connexion' ? !connexionValide : !inscriptionValide}
              onPress={onContinuer}
            />

            {mode === 'connexion' ? (
              <Pressable style={styles.linkWrap} onPress={() => router.push('/eligibilite')}>
                <Text style={styles.link}>
                  Pas encore client Fibre ? <Text style={styles.linkBold}>Tester mon éligibilité</Text>
                </Text>
              </Pressable>
            ) : (
              <Pressable style={styles.linkWrap} onPress={() => setMode('connexion')}>
                <Text style={styles.link}>
                  Déjà client ? <Text style={styles.linkBold}>Se connecter</Text>
                </Text>
              </Pressable>
            )}

            <View style={{ marginTop: spacing.sm }}>
              <Button label="Suivre ma demande" variant="ghost" onPress={() => router.push('/(tabs)/suivi')} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bgImage: { ...StyleSheet.absoluteFillObject },
  top: { flex: 1, minHeight: 90 },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xl + spacing.md,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: spacing.sm },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
    marginTop: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.slate },
  tabTextActive: { color: colors.white },
  rowFields: { flexDirection: 'row' },
  linkWrap: { alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.xs },
  link: { fontSize: 13, color: colors.slate },
  linkBold: { color: colors.primaryDark, fontWeight: '700' },
});
