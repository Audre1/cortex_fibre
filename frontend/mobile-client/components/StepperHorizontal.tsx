import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { DossierEtape, DossierEtapeId } from '@/data/types';

interface StepperHorizontalProps {
  etapes: DossierEtape[];
}

const DOT = 52;

const ICONES: Record<DossierEtapeId, keyof typeof Ionicons.glyphMap> = {
  adresse_verifiee: 'location',
  demande_recue: 'document-text',
  demande_validee: 'checkmark-done',
  rdv_a_planifier: 'calendar',
  technicien_assigne: 'person',
  installation: 'construct',
  confirmation_client: 'shield-checkmark',
  fibre_active: 'wifi',
};

function Row({ etapes }: { etapes: DossierEtape[] }) {
  return (
    <View style={styles.row}>
      {etapes.map((etape, index) => {
        const isLast = index === etapes.length - 1;
        return (
          <React.Fragment key={etape.id}>
            <View style={styles.stepWrap}>
              <View
                style={[
                  styles.dot,
                  etape.statut === 'fait' && styles.dotFait,
                  etape.statut === 'en_cours' && styles.dotEnCours,
                ]}
              >
                <Ionicons
                  name={etape.statut === 'fait' ? 'checkmark' : ICONES[etape.id]}
                  size={22}
                  color={etape.statut === 'a_venir' ? colors.muted : colors.white}
                />
              </View>
              <Text style={[styles.label, styles.labelWide, etape.statut !== 'a_venir' && styles.labelActive]}>
                {etape.titre}
              </Text>
            </View>
            {!isLast && (
              <View style={styles.connectorWrap}>
                <View style={[styles.connector, etape.statut === 'fait' && styles.connectorFait]} />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export function StepperHorizontal({ etapes }: StepperHorizontalProps) {
  const milieu = Math.ceil(etapes.length / 2);
  const premiereLigne = etapes.slice(0, milieu);
  const deuxiemeLigne = etapes.slice(milieu);

  return (
    <View>
      <Row etapes={premiereLigne} />
      {deuxiemeLigne.length > 0 && (
        <View style={styles.rowSpacing}>
          <Row etapes={deuxiemeLigne} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowSpacing: { marginTop: spacing.lg },
  stepWrap: { alignItems: 'center', width: DOT },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFait: { backgroundColor: colors.success, borderColor: colors.success },
  dotEnCours: { backgroundColor: colors.primary, borderColor: colors.primary },
  connectorWrap: { flex: 1, minWidth: 6, height: DOT, justifyContent: 'center' },
  connector: { height: 3, backgroundColor: colors.border },
  connectorFait: { backgroundColor: colors.success },
  label: {
    marginTop: spacing.xs,
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 13,
  },
  labelWide: { width: 74, marginLeft: -(74 - DOT) / 2 },
  labelActive: { color: colors.ink, fontWeight: '700' },
});
