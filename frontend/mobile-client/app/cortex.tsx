import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/ChatBubble';
import { CortexRobotIcon } from '@/components/CortexRobotIcon';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { suggestionsCortex } from '@/data/mockData';
import { Message } from '@/data/types';
import { useAppStore } from '@/store/useAppStore';

export default function CortexScreen() {
  const router = useRouter();
  const messages = useAppStore((s) => s.messagesCortex);
  const envoyerMessageCortex = useAppStore((s) => s.envoyerMessageCortex);
  const [texte, setTexte] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  function envoyer(contenu?: string) {
    const valeur = (contenu ?? texte).trim();
    if (!valeur) return;
    envoyerMessageCortex(valeur);
    setTexte('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.cortexIcon}>
          <CortexRobotIcon size={36} />
        </View>
        <View>
          <Text style={typography.h3 as any}>Assistant Cortex</Text>
          <Text style={typography.caption as any}>Toujours là pour vous aider</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ChatBubble message={item} avatarInitiales="C" avatarColor={colors.primary} />
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestions}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        >
          {suggestionsCortex.map((s) => (
            <Pressable key={s} style={styles.chip} onPress={() => envoyer(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={texte}
            onChangeText={setTexte}
            placeholder="Écrivez votre question..."
            placeholderTextColor={colors.muted}
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={() => envoyer()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  cortexIcon: {
    marginRight: spacing.sm + 2,
  },
  list: { padding: spacing.lg },
  suggestions: { flexGrow: 0, marginBottom: spacing.sm },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.primaryDark },
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
