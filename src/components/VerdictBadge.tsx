import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { VerdictType } from '../data/demo';
import { useApp } from '../context/AppContext';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
  customLabel?: string;
}

export default function VerdictBadge({
  verdict,
  size = 'md',
  customLabel,
}: VerdictBadgeProps) {
  const { t } = useApp();

  const getConfig = () => {
    switch (verdict) {
      case 'SAFE':
        return {
          icon: 'check-circle' as const,
          label: customLabel || t('verdictSafe'),
          bg: Theme.colors.safeSurface,
          border: Theme.colors.safeBorder,
          text: Theme.colors.safe,
        };
      case 'CAUTION':
        return {
          icon: 'warning' as const,
          label: customLabel || t('verdictCaution'),
          bg: Theme.colors.cautionSurface,
          border: Theme.colors.cautionBorder,
          text: Theme.colors.caution,
        };
      case 'REJECT':
      default:
        return {
          icon: 'cancel' as const,
          label: customLabel || t('verdictReject'),
          bg: Theme.colors.rejectSurface,
          border: Theme.colors.rejectBorder,
          text: Theme.colors.reject,
        };
    }
  };

  const config = getConfig();

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingVertical: isLg ? 10 : isSm ? 4 : 8,
          paddingHorizontal: isLg ? 18 : isSm ? 10 : 14,
          borderRadius: isLg ? Theme.radius.lg : Theme.radius.md,
        },
      ]}>
      <MaterialIcons
        name={config.icon}
        size={isLg ? 24 : isSm ? 16 : 20}
        color={config.text}
      />
      <Text
        style={[
          styles.label,
          {
            color: config.text,
            fontSize: isLg ? 16 : isSm ? 12 : 14,
            fontWeight: isLg ? '800' : '700',
          },
        ]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  label: {
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
