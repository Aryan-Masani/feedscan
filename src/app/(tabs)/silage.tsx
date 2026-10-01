import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import VerdictBadge from '../../components/VerdictBadge';
import Header from '../../components/Header';
import { LineChart } from 'react-native-gifted-charts';
import * as Haptics from 'expo-haptics';

export default function SilageScreen() {
  const { silos, addSilo, showToast, t } = useApp();

  const [selectedSiloId, setSelectedSiloId] = useState<string>(silos[0]?.id || 'silo-1');
  const [modalVisible, setModalVisible] = useState(false);

  // Add Silo Form fields
  const [newSiloName, setNewSiloName] = useState('');
  const [newSiloType, setNewSiloType] = useState('Corn Silage Bunker');
  const [newSiloCap, setNewSiloCap] = useState('80');

  // Live fluctuating sensor readings for the active silo
  const activeSilo = silos.find((s) => s.id === selectedSiloId) || silos[0];
  const [liveMetrics, setLiveMetrics] = useState({
    ph: activeSilo?.ph || 4.9,
    moisture: activeSilo?.moisture || 67.2,
    temp: activeSilo?.temperature || 36.8,
    gas: activeSilo?.gasPpm || 18,
  });

  // Update live readings every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMetrics((prev) => ({
        ph: +(prev.ph + (Math.random() * 0.04 - 0.02)).toFixed(2),
        moisture: +(prev.moisture + (Math.random() * 0.2 - 0.1)).toFixed(1),
        temp: +(prev.temp + (Math.random() * 0.2 - 0.1)).toFixed(1),
        gas: Math.max(2, Math.round(prev.gas + (Math.random() * 2 - 1))),
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectSilo = (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSelectedSiloId(id);
    const silo = silos.find((s) => s.id === id);
    if (silo) {
      setLiveMetrics({
        ph: silo.ph,
        moisture: silo.moisture,
        temp: silo.temperature,
        gas: silo.gasPpm,
      });
    }
  };

  const handleAddSiloSubmit = () => {
    if (!newSiloName.trim()) {
      showToast('Please enter a silo name');
      return;
    }
    addSilo(newSiloName, newSiloType, parseInt(newSiloCap, 10) || 60);
    setNewSiloName('');
    setModalVisible(false);
  };

  // Convert 7-day history to GiftedCharts format
  const phChartData = (activeSilo?.history7Days || []).map((h) => ({
    value: h.ph,
    label: h.day,
  }));

  const tempChartData = (activeSilo?.history7Days || []).map((h) => ({
    value: h.temp,
    label: h.day,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Screen Title & Add Silo Button */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>{t('silageMonitorTitle')}</Text>
            <Text style={styles.screenSub}>Continuous anaerobic fermentation tracking</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}>
            <MaterialIcons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Silo</Text>
          </TouchableOpacity>
        </View>

        {/* Silos Horizontal / Grid Picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.silosListContainer}>
          {silos.map((silo) => {
            const isSelected = silo.id === selectedSiloId;
            return (
              <TouchableOpacity
                key={silo.id}
                style={[
                  styles.siloSelectorCard,
                  isSelected && styles.siloSelectorCardActive,
                ]}
                onPress={() => handleSelectSilo(silo.id)}
                activeOpacity={0.85}>
                <View style={styles.siloCardTop}>
                  <Text style={styles.siloName}>{silo.name}</Text>
                  <VerdictBadge verdict={silo.riskStatus} size="sm" />
                </View>
                <Text style={styles.siloTypeSub}>{silo.type}</Text>
                <View style={styles.siloMiniStats}>
                  <Text style={styles.siloMiniText}>Day {silo.daysPacked}</Text>
                  <Text style={styles.siloMiniText}>pH {silo.ph}</Text>
                  <Text style={styles.siloMiniText}>{silo.capacityTonnes}T</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Detail View of Active Silo */}
        {activeSilo && (
          <View style={styles.detailContainer}>
            {/* Spoilage Risk Alert Banner */}
            {activeSilo.riskStatus === 'CAUTION' && (
              <View style={styles.alertBanner}>
                <MaterialIcons name="warning" size={20} color="#BF360C" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertBannerTitle}>Aerobic Exposure Warning</Text>
                  <Text style={styles.alertBannerText}>
                    pH is 4.9. Plastic seal requires immediate tightening to avoid top mould.
                  </Text>
                </View>
              </View>
            )}

            {/* Live Fluctuating Telemetry Gauges */}
            <View style={styles.sectionBox}>
              <View style={styles.telemetryHeader}>
                <Text style={styles.sectionHeaderTitle}>Live In-Situ Telemetry</Text>
                <View style={styles.livePulseBadge}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.livePulseText}>Auto-Updating (2s)</Text>
                </View>
              </View>

              <View style={styles.gaugesGrid}>
                {/* Gauge 1: pH */}
                <View style={styles.gaugeBox}>
                  <Text style={styles.gaugeLabel}>Acidity (pH)</Text>
                  <Text
                    style={[
                      styles.gaugeValue,
                      {
                        color:
                          liveMetrics.ph < 4.4
                            ? Theme.colors.safe
                            : Theme.colors.caution,
                      },
                    ]}>
                    {liveMetrics.ph}
                  </Text>
                  <Text style={styles.gaugeSub}>Optimal: 3.8 - 4.2</Text>
                </View>

                {/* Gauge 2: Moisture */}
                <View style={styles.gaugeBox}>
                  <Text style={styles.gaugeLabel}>Moisture</Text>
                  <Text style={styles.gaugeValue}>{liveMetrics.moisture}%</Text>
                  <Text style={styles.gaugeSub}>Optimal: 65 - 70%</Text>
                </View>

                {/* Gauge 3: Temp */}
                <View style={styles.gaugeBox}>
                  <Text style={styles.gaugeLabel}>Temperature</Text>
                  <Text
                    style={[
                      styles.gaugeValue,
                      {
                        color:
                          liveMetrics.temp > 35
                            ? Theme.colors.caution
                            : Theme.colors.text,
                      },
                    ]}>
                    {liveMetrics.temp}°C
                  </Text>
                  <Text style={styles.gaugeSub}>Threshold: &lt; 32°C</Text>
                </View>

                {/* Gauge 4: Gas */}
                <View style={styles.gaugeBox}>
                  <Text style={styles.gaugeLabel}>CO2 / Gas</Text>
                  <Text style={styles.gaugeValue}>{liveMetrics.gas} ppm</Text>
                  <Text style={styles.gaugeSub}>Anaerobic Safe</Text>
                </View>
              </View>
            </View>

            {/* Spoilage Risk Meter */}
            <View style={styles.sectionBox}>
              <View style={styles.spoilageHeader}>
                <Text style={styles.sectionHeaderTitle}>{t('spoilageRiskMeter')}</Text>
                <Text
                  style={[
                    styles.spoilageScore,
                    {
                      color:
                        activeSilo.riskScore > 80
                          ? Theme.colors.safe
                          : Theme.colors.caution,
                    },
                  ]}>
                  {activeSilo.riskScore}/100 Safe Index
                </Text>
              </View>

              <View style={styles.riskTrack}>
                <View
                  style={[
                    styles.riskFill,
                    {
                      width: `${activeSilo.riskScore}%`,
                      backgroundColor:
                        activeSilo.riskScore > 80
                          ? Theme.colors.safe
                          : Theme.colors.caution,
                    },
                  ]}
                />
              </View>
              <Text style={styles.riskDesc}>
                {activeSilo.riskScore > 80
                  ? 'Strong anaerobic stability with minimal lactic acid degradation.'
                  : 'Moderate mould risk at surface edges. Discard top layer before mixing into feed bunk.'}
              </Text>
            </View>

            {/* Fermentation Timeline (Day 0 to Ready) */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeaderTitle}>Fermentation Stage Timeline</Text>
              <View style={styles.timelineRow}>
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineNode, styles.nodeActive]}>
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.timelineLabel}>Phase 1</Text>
                  <Text style={styles.timelineSub}>Packing</Text>
                </View>

                <View style={[styles.timelineConnector, styles.connectorActive]} />

                <View style={styles.timelineItem}>
                  <View style={[styles.timelineNode, styles.nodeActive]}>
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.timelineLabel}>Phase 2</Text>
                  <Text style={styles.timelineSub}>Acetic</Text>
                </View>

                <View style={[styles.timelineConnector, styles.connectorActive]} />

                <View style={styles.timelineItem}>
                  <View style={[styles.timelineNode, styles.nodeActive]}>
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.timelineLabel}>Phase 3</Text>
                  <Text style={styles.timelineSub}>Lactic</Text>
                </View>

                <View style={[styles.timelineConnector, activeSilo.daysPacked > 40 && styles.connectorActive]} />

                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineNode,
                      activeSilo.daysPacked > 40 && styles.nodeActive,
                    ]}>
                    <MaterialIcons name="done-all" size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.timelineLabel}>Phase 4</Text>
                  <Text style={styles.timelineSub}>Stable Ready</Text>
                </View>
              </View>
              <Text style={styles.currentStageText}>
                Current Status: {activeSilo.fermentationStage} (Day {activeSilo.daysPacked})
              </Text>
            </View>

            {/* 7-Day Trend Curves Chart */}
            <View style={[styles.sectionBox, { marginBottom: 30 }]}>
              <Text style={styles.sectionHeaderTitle}>{t('trendChartsTitle')}</Text>
              <Text style={styles.chartSubtitle}>Acidity (pH) Curve over last 7 days</Text>
              <View style={styles.chartHolder}>
                <LineChart
                  data={phChartData}
                  color={Theme.colors.primary}
                  thickness={3}
                  dataPointsColor={Theme.colors.primaryDark}
                  dataPointsRadius={5}
                  height={130}
                  maxValue={6.0}
                  noOfSections={3}
                  isAnimated
                  xAxisLabelTextStyle={{ fontSize: 11, color: Theme.colors.textSecondary }}
                  yAxisTextStyle={{ fontSize: 11, color: Theme.colors.textMuted }}
                  yAxisThickness={1}
                  xAxisThickness={1}
                />
              </View>

              <Text style={[styles.chartSubtitle, { marginTop: 14 }]}>Core Temperature (°C) Trend</Text>
              <View style={styles.chartHolder}>
                <LineChart
                  data={tempChartData}
                  color={Theme.colors.accent}
                  thickness={3}
                  dataPointsColor={Theme.colors.accentDark}
                  dataPointsRadius={5}
                  height={130}
                  maxValue={45}
                  noOfSections={3}
                  isAnimated
                  xAxisLabelTextStyle={{ fontSize: 11, color: Theme.colors.textSecondary }}
                  yAxisTextStyle={{ fontSize: 11, color: Theme.colors.textMuted }}
                  yAxisThickness={1}
                  xAxisThickness={1}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add New Silo Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('addSiloBtn')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={22} color={Theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Silo Identifier / Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Bunker Silo D, South Pit 2"
              value={newSiloName}
              onChangeText={setNewSiloName}
            />

            <Text style={styles.inputLabel}>Crop / Silage Type</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Corn Fodder, Sorghum + Inoculant"
              value={newSiloType}
              onChangeText={setNewSiloType}
            />

            <Text style={styles.inputLabel}>Capacity (Metric Tonnes)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 75"
              keyboardType="numeric"
              value={newSiloCap}
              onChangeText={setNewSiloCap}
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleAddSiloSubmit}
              activeOpacity={0.85}>
              <Text style={styles.modalSubmitBtnText}>Create Silo Monitor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.radius.full,
    ...Theme.shadows.soft,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  silosListContainer: {
    gap: 12,
    paddingBottom: 16,
  },
  siloSelectorCard: {
    width: 200,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  siloSelectorCardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySurface,
  },
  siloCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  siloName: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  siloTypeSub: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 10,
  },
  siloMiniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  siloMiniText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  detailContainer: {
    gap: 14,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFEBEE',
    padding: 14,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: '#EF9A9A',
  },
  alertBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C62828',
  },
  alertBannerText: {
    fontSize: 12,
    color: '#B71C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionBox: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.safe,
  },
  livePulseText: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  gaugesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gaugeBox: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  gaugeLabel: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  gaugeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.text,
    marginVertical: 4,
  },
  gaugeSub: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
  },
  spoilageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  spoilageScore: {
    fontSize: 13,
    fontWeight: '800',
  },
  riskTrack: {
    height: 10,
    backgroundColor: '#EAECE4',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  riskFill: {
    height: '100%',
    borderRadius: 5,
  },
  riskDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
    paddingHorizontal: 8,
  },
  timelineItem: {
    alignItems: 'center',
  },
  timelineNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CFD8DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  nodeActive: {
    backgroundColor: Theme.colors.primary,
  },
  timelineConnector: {
    flex: 1,
    height: 3,
    backgroundColor: '#CFD8DC',
    marginBottom: 18,
  },
  connectorActive: {
    backgroundColor: Theme.colors.primary,
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  timelineSub: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  currentStageText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginBottom: 10,
  },
  chartHolder: {
    alignItems: 'center',
    paddingTop: 8,
    paddingRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    padding: 24,
    ...Theme.shadows.glow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  modalSubmitBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
    minHeight: 56,
    ...Theme.shadows.glow,
  },
  modalSubmitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
