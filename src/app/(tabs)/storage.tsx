import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { STORAGE_GODOWNS } from '../../data/demo';
import VerdictBadge from '../../components/VerdictBadge';
import Header from '../../components/Header';
import { LineChart } from 'react-native-gifted-charts';

export default function StorageScreen() {
  const { t } = useApp();
  const [selectedGodownId, setSelectedGodownId] = useState(STORAGE_GODOWNS[0].id);

  const activeGodown =
    STORAGE_GODOWNS.find((g) => g.id === selectedGodownId) || STORAGE_GODOWNS[0];

  // 7-day humidity trend data
  const humidityTrend = [
    { value: 68, label: 'D-6' },
    { value: 72, label: 'D-5' },
    { value: 76, label: 'D-4' },
    { value: 80, label: 'D-3' },
    { value: 82, label: 'D-2' },
    { value: 85, label: 'D-1' },
    { value: 84, label: 'Now' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.headerTitleBox}>
          <Text style={styles.screenTitle}>{t('storageTitle')}</Text>
          <Text style={styles.screenSub}>
            Ambient climate telemetry and mould spores prevention
          </Text>
        </View>

        {/* 2 Godown Cards (North Shed vs South Yard) */}
        <View style={styles.godownToggleRow}>
          {STORAGE_GODOWNS.map((godown) => {
            const isSelected = godown.id === selectedGodownId;
            return (
              <TouchableOpacity
                key={godown.id}
                style={[
                  styles.godownCard,
                  isSelected && styles.godownCardActive,
                ]}
                onPress={() => setSelectedGodownId(godown.id)}
                activeOpacity={0.85}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.godownName}>{godown.name}</Text>
                  <VerdictBadge verdict={godown.status} size="sm" />
                </View>
                <Text style={styles.bagCountText}>{godown.bagCount} feed bags stored</Text>

                <View style={styles.climateRow}>
                  <View style={styles.climateItem}>
                    <MaterialIcons name="device-thermostat" size={16} color={Theme.colors.textMuted} />
                    <Text style={styles.climateVal}>{godown.temperature}°C</Text>
                  </View>
                  <View style={styles.climateItem}>
                    <MaterialIcons name="water-drop" size={16} color="#0288D1" />
                    <Text style={[styles.climateVal, { color: godown.humidity > 75 ? Theme.colors.caution : '#0288D1' }]}>
                      {godown.humidity}% RH
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detailed Mould Risk Meter for Selected Godown */}
        <View style={styles.sectionCard}>
          <View style={styles.mouldHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t('mouldRiskIndex')}</Text>
              <Text style={styles.mouldSub}>Active ambient incubation vulnerability</Text>
            </View>
            <Text
              style={[
                styles.mouldScoreVal,
                {
                  color:
                    activeGodown.mouldRisk > 6
                      ? Theme.colors.reject
                      : Theme.colors.safe,
                },
              ]}>
              {activeGodown.mouldRisk} / 10
            </Text>
          </View>

          <View style={styles.mouldTrack}>
            <View
              style={[
                styles.mouldBar,
                {
                  width: `${activeGodown.mouldRisk * 10}%`,
                  backgroundColor:
                    activeGodown.mouldRisk > 6
                      ? Theme.colors.reject
                      : Theme.colors.safe,
                },
              ]}
            />
          </View>

          <View style={styles.mouldScaleLabels}>
            <Text style={styles.mouldLabel}>0 (Dry Safe)</Text>
            <Text style={styles.mouldLabel}>5 (Moderate)</Text>
            <Text style={styles.mouldLabel}>10 (High Spores Risk)</Text>
          </View>
        </View>

        {/* Humidity Trend Chart */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Relative Humidity Trend (% RH)</Text>
          <Text style={styles.chartSubtitle}>
            Continuous 7-day hygrometer readings in {activeGodown.name}
          </Text>
          <View style={styles.chartHolder}>
            <LineChart
              data={humidityTrend}
              color="#0288D1"
              thickness={3}
              dataPointsColor="#01579B"
              dataPointsRadius={5}
              height={140}
              maxValue={100}
              noOfSections={4}
              isAnimated
              xAxisLabelTextStyle={{ fontSize: 11, color: Theme.colors.textSecondary }}
              yAxisTextStyle={{ fontSize: 11, color: Theme.colors.textMuted }}
              yAxisThickness={1}
              xAxisThickness={1}
            />
          </View>
        </View>

        {/* Recommendations / Best Practices */}
        <View style={[styles.sectionCard, { marginBottom: 30 }]}>
          <View style={styles.tipsHeader}>
            <MaterialIcons name="lightbulb" size={20} color={Theme.colors.accent} />
            <Text style={styles.sectionTitle}>{t('storageTipsTitle')}</Text>
          </View>

          {activeGodown.recommendations.map((rec, i) => (
            <View key={i} style={styles.recItemRow}>
              <View style={styles.recCheckCircle}>
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  headerTitleBox: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  screenSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  godownToggleRow: {
    gap: 12,
    marginBottom: 16,
  },
  godownCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  godownCardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySurface,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  godownName: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  bagCountText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 12,
  },
  climateRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  climateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  climateVal: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  sectionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  mouldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mouldSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  mouldScoreVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  mouldTrack: {
    height: 12,
    backgroundColor: '#EAECE4',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  mouldBar: {
    height: '100%',
    borderRadius: 6,
  },
  mouldScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mouldLabel: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  chartSubtitle: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  chartHolder: {
    alignItems: 'center',
    paddingTop: 6,
    paddingRight: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  recItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  recText: {
    flex: 1,
    fontSize: 13,
    color: Theme.colors.text,
    lineHeight: 19,
    fontWeight: '600',
  },
});
