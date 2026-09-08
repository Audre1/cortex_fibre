import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={appTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cortex" options={{ presentation: 'card' }} />
        <Stack.Screen name="eligibilite" options={{ presentation: 'card' }} />
        <Stack.Screen name="commande" options={{ presentation: 'card' }} />
        <Stack.Screen name="demande-confirmation" options={{ presentation: 'card', gestureEnabled: false }} />
        <Stack.Screen name="technicien/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="signalement-absence" options={{ presentation: 'modal' }} />
        <Stack.Screen name="signalement-probleme" options={{ presentation: 'card' }} />
        <Stack.Screen name="intervention-confirmation" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reclamation" options={{ presentation: 'card' }} />
        <Stack.Screen name="reclamation-confirmation" options={{ presentation: 'card', gestureEnabled: false }} />
        <Stack.Screen name="reclamations" options={{ presentation: 'card' }} />
        <Stack.Screen name="reclamation/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="dossier/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
        <Stack.Screen name="diagnostic" options={{ presentation: 'card' }} />
        <Stack.Screen name="gerer-wifi" options={{ presentation: 'card' }} />
        <Stack.Screen name="recharge" options={{ presentation: 'card' }} />
        <Stack.Screen name="mes-demandes" options={{ presentation: 'card' }} />
        <Stack.Screen name="changement-offre" options={{ presentation: 'card' }} />
        <Stack.Screen name="demenagement" options={{ presentation: 'card' }} />
        <Stack.Screen name="demenagement-nouvelle-demande" options={{ presentation: 'card' }} />
      </Stack>
    </ThemeProvider>
  );
}
