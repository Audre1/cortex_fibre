import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CortexRobotIcon } from '@/components/CortexRobotIcon';
import { Avatar } from '@/components/ui/Avatar';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Message } from '@/data/types';

interface ChatBubbleProps {
  message: Message;
  avatarInitiales: string;
  avatarColor?: string;
}

export function ChatBubble({ message, avatarInitiales, avatarColor }: ChatBubbleProps) {
  const isClient = message.auteur === 'client';
  const isCortex = message.auteur === 'cortex';

  return (
    <View style={[styles.row, isClient && styles.rowReverse]}>
      {!isClient && isCortex && <CortexRobotIcon size={30} />}
      {!isClient && !isCortex && (
        <Avatar initiales={avatarInitiales} size={30} background={avatarColor ?? colors.primary} />
      )}
      <View style={[styles.bubble, isClient ? styles.bubbleClient : styles.bubbleAutre]}>
        <Text style={[typography.body as any, isClient && styles.textClient]}>{message.texte}</Text>
        <Text style={[styles.heure, isClient && styles.heureClient]}>{message.heure}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    maxWidth: '88%',
    alignSelf: 'flex-start',
  },
  rowReverse: { flexDirection: 'row-reverse', alignSelf: 'flex-end' },
  bubble: {
    flexShrink: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginHorizontal: spacing.sm,
  },
  bubbleAutre: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleClient: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  textClient: { color: colors.white },
  heure: { fontSize: 11, color: colors.muted, marginTop: 4, textAlign: 'right' },
  heureClient: { color: 'rgba(255,255,255,0.75)' },
});
