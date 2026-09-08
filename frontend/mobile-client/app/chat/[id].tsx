import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/ChatBubble';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing } from '@/constants/theme';
import { Message } from '@/data/types';
import { useAppStore } from '@/store/useAppStore';

export default function ChatTechnicienScreen() {
  const dossier = useAppStore((s) => s.dossier);
  const messages = useAppStore((s) => s.messagesTechnicien);
  const envoyerMessageTechnicien = useAppStore((s) => s.envoyerMessageTechnicien);
  const [texte, setTexte] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const technicien = dossier?.technicien;

  function envoyer() {
    const valeur = texte.trim();
    if (!valeur) return;
    envoyerMessageTechnicien(valeur);
    setTexte('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Message au technicien"
        subtitle={dossier ? `Mission ${dossier.numero}` : undefined}
      />

      <View style={styles.protectedBanner}>
        <Ionicons name="lock-closed" size={13} color={colors.slate} />
        <Text style={styles.protectedBannerText}>
          Échange protégé par Orange · Vos coordonnées personnelles restent masquées.
        </Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ChatBubble message={item} avatarInitiales={technicien?.initiales ?? 'T'} />
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={texte}
            onChangeText={setTexte}
            placeholder="Écrire un message..."
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={envoyer}
            disabled={!texte.trim()}
            style={[styles.sendButton, !texte.trim() && styles.sendButtonDisabled]}
          >
            <Ionicons name="arrow-up" size={20} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  protectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  protectedBannerText: { marginLeft: spacing.xs, fontSize: 11, color: colors.slate, fontWeight: '600' },
  list: { padding: spacing.lg },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
});
