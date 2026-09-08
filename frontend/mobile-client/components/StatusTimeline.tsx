import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';
import { DossierEtape } from '@/data/types';

interface StatusTimelineProps {
  etapes: DossierEtape[];
}

export function StatusTimeline({ etapes }: StatusTimelineProps) {
  return (
    <View>
      {etapes.map((etape, index) => {
        const isLast = index === etapes.length - 1;
        return (
          <View key={etape.id} style={styles.row}>
            <View style={styles.indicatorColumn}>
              <View
                style={[
                  styles.dot,
                  etape.statut === 'fait' && styles.dotFait,
                  etape.statut === 'en_cours' && styles.dotEnCours,
                ]}
              >
                {etape.statut === 'fait' && <Ionicons name="checkmark" size={13} color={colors.white} />}
                {etape.statut === 'en_cours' && <View style={styles.pulseDot} />}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    etape.statut === 'fait' && styles.lineFait,
                  ]}
                />
              )}
            </View>
            <View style={[styles.content, !isLast && styles.contentSpacing]}>
              <Text
                style={[
                  typography.bodyBold as any,
                  etape.statut === 'a_venir' && styles.textMuted,
                ]}
              >
                {etape.titre}
              </Text>
              <Text style={[typography.caption as any, styles.description, etape.statut === 'a_venir' && styles.textMuted]}>
                {etape.description}
              </Text>
              {etape.date && <Text style={styles.date}>{etape.date}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const DOT_SIZE = 24;

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  indicatorColumn: { alignItems: 'center', width: DOT_SIZE },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFait: { backgroundColor: colors.success },
  dotEnCours: { backgroundColor: colors.primarySoft, borderWidth: 2, borderColor: colors.primary },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  lineFait: { backgroundColor: colors.success },
  content: { flex: 1, marginLeft: spacing.md, paddingBottom: spacing.lg },
  contentSpacing: {},
  description: { marginTop: 2 },
  date: { marginTop: spacing.xs, fontSize: 12, fontWeight: '600', color: colors.primaryDark },
  textMuted: { color: colors.muted },
});
