import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../constants/theme';
import { NutritionMetric } from '../data/demo';
import { useApp } from '../context/AppContext';

interface NutritionGaugeProps {
  metric: NutritionMetric;
}

export default function NutritionGauge({ metric }: NutritionGaugeProps) {
  const { t } = useApp();

  // Scale estimation: assume maximum bar scale is max(targetMax * 1.4, value * 1.2, 30)
  const maxScale = Math.max(metric.targetMax * 1.35, metric.value * 1.2, 30);
  const currentPercent = Math.min(100, Math.max(4, (metric.value / maxScale) * 100));
  const targetMinPercent = (metric.targetMin / maxScale) * 100;
  const targetWidthPercent = ((metric.targetMax - metric.targetMin) / maxScale) * 100;

  const getStatusColor = () => {
    switch (metric.status) {
      case 'normal':
        return { bar: Theme.colors.safe, bg: Theme.colors.safeSurface, label: 'Optimal' };
      case 'low':
        return { bar: Theme.colors.caution, bg: Theme.colors.cautionSurface, label: 'Sub-optimal' };
      case 'high':
        return { bar: Theme.colors.caution, bg: Theme.colors.cautionSurface, label: 'High' };
      case 'danger':
      default:
        return { bar: Theme.colors.reject, bg: Theme.colors.rejectSurface, label: 'Critical' };
    }
  };

  const status = getStatusColor();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.name}>{t(metric.nameKey)}</Text>
          <Text style={styles.targetLabel}>
            Target: {metric.targetMin} - {metric.targetMax} {metric.unit}
          </Text>
        </View>

        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: status.bar }]}>
            {metric.value} <Text style={styles.unitText}>{metric.unit}</Text>
          </Text>
          <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.bar }]}>{status.label}</Text>
          </View>
        </View>
      </View>

      {/* Target range track */}
      <View style={styles.trackContainer}>
        {/* Recommended Target Zone highlight */}
        <View
          style={[
            styles.targetZone,
            {
              left: `${targetMinPercent}%`,
              width: `${targetWidthPercent}%`,
            },
          ]}
        />

        {/* Current Value Filled Bar */}
        <View
          style={[
            styles.filledBar,
            {
              width: `${currentPercent}%`,
              backgroundColor: status.bar,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    padding: 14,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 10,
    ...Theme.shadows.soft,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  targetLabel: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 18,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  trackContainer: {
    height: 10,
    backgroundColor: '#EAECE4',
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 4,
  },
  targetZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#C8E6C9', // light green zone
    borderRadius: 3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#81C784',
  },
  filledBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 5,
  },
});
