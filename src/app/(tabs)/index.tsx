import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import VerdictBadge from '../../components/VerdictBadge';
import {
  FARMER_PROFILE,
  OFFICER_KPIS,
  REGIONAL_HEATMAP,
  SUPPLIER_LEADERBOARD,
  OFFICER_ALERTS,
  TestResultData,
} from '../../data/demo';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import * as Haptics from 'expo-haptics';

export default function HomeOrDashboardScreen() {
  const {
    role,
    history,
    setCurrentResult,
    setSelectedSampleType,
    startListening,
    showToast,
    t,
  } = useApp();

  const handleTestFeed = (sampleType: 'compound' | 'silage' = 'compound') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setSelectedSampleType(sampleType);
    router.push('/test-flow');
  };

  const handleViewResult = (item: TestResultData) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCurrentResult(item);
    router.push('/result');
  };

  const renderFarmerHome = () => (
    <>
      {/* Farmer Greeting Banner */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingRow}>
          <View style={styles.farmerAvatar}>
            <MaterialIcons name="person" size={28} color={Theme.colors.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>{t('greeting')}</Text>
            <View style={styles.farmSubRow}>
              <MaterialIcons name="place" size={14} color={Theme.colors.textMuted} />
              <Text style={styles.farmSubText}>{FARMER_PROFILE.village}</Text>
            </View>
          </View>
          <View style={styles.herdBadge}>
            <Text style={styles.herdBadgeCount}>
              {FARMER_PROFILE.cowsCount + FARMER_PROFILE.buffaloCount}
            </Text>
            <Text style={styles.herdBadgeLabel}>Cattle</Text>
          </View>
        </View>
      </View>

      {/* 3 Big Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionHeaderTitle}>{t('quickActions')}</Text>

        <View style={styles.bigActionGrid}>
          {/* Action 1: Test Feed */}
          <TouchableOpacity
            style={[styles.bigActionCard, { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' }]}
            onPress={() => handleTestFeed('compound')}
            activeOpacity={0.85}>
            <View style={[styles.actionIconCircle, { backgroundColor: Theme.colors.primary }]}>
              <MaterialIcons name="science" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>{t('actionTestFeed')}</Text>
            <Text style={styles.actionSub}>{t('actionTestFeedSub')}</Text>
            <View style={styles.actionBadgeRow}>
              <Text style={styles.actionBadgeText}>Start Test</Text>
              <MaterialIcons name="arrow-forward" size={14} color={Theme.colors.primaryDark} />
            </View>
          </TouchableOpacity>

          {/* Action 2: Test Silage */}
          <TouchableOpacity
            style={[styles.bigActionCard, { backgroundColor: '#FFF8E1', borderColor: '#FFE082' }]}
            onPress={() => handleTestFeed('silage')}
            activeOpacity={0.85}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#FFA000' }]}>
              <MaterialIcons name="inventory" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>{t('actionTestSilage')}</Text>
            <Text style={styles.actionSub}>{t('actionTestSilageSub')}</Text>
            <View style={styles.actionBadgeRow}>
              <Text style={[styles.actionBadgeText, { color: '#E65100' }]}>Check pH</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#E65100" />
            </View>
          </TouchableOpacity>

          {/* Action 3: Scan QR */}
          <TouchableOpacity
            style={[styles.bigActionCard, { backgroundColor: '#EDE7F6', borderColor: '#D1C4E9' }]}
            onPress={() => router.push('/scan-qr')}
            activeOpacity={0.85}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#7E57C2' }]}>
              <MaterialIcons name="qr-code-scanner" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.actionTitle}>{t('actionScanQR')}</Text>
            <Text style={styles.actionSub}>{t('actionScanQRSub')}</Text>
            <View style={styles.actionBadgeRow}>
              <Text style={[styles.actionBadgeText, { color: '#512DA8' }]}>Scan Bag</Text>
              <MaterialIcons name="arrow-forward" size={14} color="#512DA8" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Priority Alerts Strip */}
      <View style={styles.alertsStripContainer}>
        <View style={styles.stripHeader}>
          <MaterialIcons name="warning" size={18} color="#D84315" />
          <Text style={styles.stripHeaderTitle}>{t('alertsTitle')}</Text>
        </View>

        {/* Alert 1 */}
        <TouchableOpacity
          style={styles.alertItemCard}
          onPress={() => router.push('/(tabs)/silage')}
          activeOpacity={0.8}>
          <View style={styles.alertDot} />
          <Text style={styles.alertItemText}>{t('alertSilageText')}</Text>
          <MaterialIcons name="chevron-right" size={20} color={Theme.colors.textMuted} />
        </TouchableOpacity>

        {/* Alert 2 */}
        <TouchableOpacity
          style={styles.alertItemCard}
          onPress={() => router.push('/(tabs)/storage')}
          activeOpacity={0.8}>
          <View style={[styles.alertDot, { backgroundColor: '#E65100' }]} />
          <Text style={styles.alertItemText}>{t('alertGodownText')}</Text>
          <MaterialIcons name="chevron-right" size={20} color={Theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Monthly Quality Snapshot */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionHeaderTitle}>{t('statsTitle')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>{t('statTestsMonth')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: Theme.colors.safe }]}>78.4</Text>
            <Text style={styles.statLabel}>{t('statAvgQuality')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: Theme.colors.reject }]}>2</Text>
            <Text style={styles.statLabel}>{t('statRejected')}</Text>
          </View>
        </View>
      </View>

      {/* Recent Feed Tests */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>{t('recentTestsTitle')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.viewAllLink}>{t('viewAllHistory')} →</Text>
          </TouchableOpacity>
        </View>

        {history.slice(0, 4).map((test) => (
          <TouchableOpacity
            key={test.id}
            style={styles.testCard}
            onPress={() => handleViewResult(test)}
            activeOpacity={0.8}>
            <View style={styles.testCardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.testSampleName}>{test.sampleName}</Text>
                <Text style={styles.testBatchDate}>
                  {test.brandName} • {test.testDate}
                </Text>
              </View>
              <VerdictBadge verdict={test.verdict} size="sm" />
            </View>

            <View style={styles.testScoreRow}>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillLabel}>Score:</Text>
                <Text
                  style={[
                    styles.scorePillVal,
                    {
                      color:
                        test.verdict === 'SAFE'
                          ? Theme.colors.safe
                          : test.verdict === 'CAUTION'
                          ? Theme.colors.caution
                          : Theme.colors.reject,
                    },
                  ]}>
                  {test.score}/100
                </Text>
              </View>
              <Text style={styles.proteinPill}>
                Protein: {test.metrics.protein.value}%
              </Text>
              <Text style={styles.moisturePill}>
                Moisture: {test.metrics.moisture.value}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderOfficerDashboard = () => {
    // Gifted charts data for block adulteration
    const blockBarData = [
      { value: 5.2, label: 'Anand', frontColor: Theme.colors.safe },
      { value: 14.8, label: 'Borsad', frontColor: Theme.colors.reject },
      { value: 4.1, label: 'Petlad', frontColor: Theme.colors.safe },
      { value: 11.2, label: 'Khambhat', frontColor: Theme.colors.caution },
      { value: 3.4, label: 'Umreth', frontColor: Theme.colors.safe },
    ];

    // Aflatoxin weekly trend
    const aflatoxinLineData = [
      { value: 8, label: 'W1' },
      { value: 10, label: 'W2' },
      { value: 16, label: 'W3' },
      { value: 22, label: 'W4' },
      { value: 18, label: 'Now' },
    ];

    return (
      <>
        {/* Officer Title */}
        <View style={styles.officerHeaderCard}>
          <Text style={styles.officerTitle}>{t('officerDashboardTitle')}</Text>
          <Text style={styles.officerSub}>
            Anand District Milk Cooperative Union Surveillance
          </Text>
        </View>

        {/* KPI Tiles */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{OFFICER_KPIS.totalBatchesTested}</Text>
            <Text style={styles.kpiLabel}>{t('kpiTotalTested')}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: Theme.colors.reject }]}>
              {OFFICER_KPIS.adulterationRate}%
            </Text>
            <Text style={styles.kpiLabel}>{t('kpiAdulterationRate')}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: Theme.colors.caution }]}>
              {OFFICER_KPIS.highRiskFarmsCount}
            </Text>
            <Text style={styles.kpiLabel}>{t('kpiHighRiskFarms')}</Text>
          </View>
        </View>

        {/* Regional Contamination Heat Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>{t('regionalHeatmapTitle')}</Text>
          <View style={styles.heatmapGrid}>
            {REGIONAL_HEATMAP.map((block) => {
              const isReject = block.status === 'REJECT';
              const isCaution = block.status === 'CAUTION';
              const bg = isReject
                ? Theme.colors.rejectSurface
                : isCaution
                ? Theme.colors.cautionSurface
                : Theme.colors.safeSurface;
              const border = isReject
                ? Theme.colors.rejectBorder
                : isCaution
                ? Theme.colors.cautionBorder
                : Theme.colors.safeBorder;
              const textColor = isReject
                ? Theme.colors.reject
                : isCaution
                ? Theme.colors.caution
                : Theme.colors.safe;

              return (
                <View
                  key={block.name}
                  style={[
                    styles.heatCard,
                    { backgroundColor: bg, borderColor: border },
                  ]}>
                  <Text style={styles.heatBlockName}>{block.name}</Text>
                  <Text style={[styles.heatAdulteration, { color: textColor }]}>
                    {block.adulterationRate}% Urea
                  </Text>
                  <Text style={styles.heatTestsCount}>{block.testsCount} batches</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Charts: Adulteration by Block Bar Chart */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Urea Adulteration Rate by Block (%)</Text>
          <View style={styles.chartWrapper}>
            <BarChart
              data={blockBarData}
              barWidth={36}
              noOfSections={4}
              maxValue={20}
              isAnimated
              animationDuration={800}
              xAxisLabelTextStyle={{ fontSize: 11, color: Theme.colors.textSecondary }}
              yAxisTextStyle={{ fontSize: 11, color: Theme.colors.textMuted }}
              height={160}
              yAxisThickness={1}
              xAxisThickness={1}
            />
          </View>
        </View>

        {/* Charts: Aflatoxin Weekly Trend Line Chart */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Aflatoxin B1 Trend (ppb - District Avg)</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={aflatoxinLineData}
              color={Theme.colors.caution}
              thickness={3}
              dataPointsColor={Theme.colors.cautionDark}
              dataPointsRadius={5}
              height={140}
              noOfSections={4}
              maxValue={25}
              isAnimated
              xAxisLabelTextStyle={{ fontSize: 11, color: Theme.colors.textSecondary }}
              yAxisTextStyle={{ fontSize: 11, color: Theme.colors.textMuted }}
              yAxisThickness={1}
              xAxisThickness={1}
            />
          </View>
        </View>

        {/* Supplier Quality Leaderboard */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>{t('vendorLeaderboardTitle')}</Text>
          {SUPPLIER_LEADERBOARD.map((sup, idx) => (
            <View key={sup.name} style={styles.supplierRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNum}>#{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.supName}>{sup.name}</Text>
                <Text style={styles.supLoc}>
                  {sup.location} • {sup.batchesSupplied} batches
                </Text>
              </View>
              <View style={styles.supScoreBox}>
                <Text
                  style={[
                    styles.supScore,
                    {
                      color:
                        sup.status === 'SAFE'
                          ? Theme.colors.safe
                          : sup.status === 'CAUTION'
                          ? Theme.colors.caution
                          : Theme.colors.reject,
                    },
                  ]}>
                  {sup.score}/100
                </Text>
                <Text style={styles.supGrade}>Grade {sup.grade}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* High Risk Alert Feed */}
        <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
          <Text style={styles.sectionHeaderTitle}>District Alert Feed</Text>
          {OFFICER_ALERTS.map((alert) => (
            <View key={alert.id} style={styles.officerAlertCard}>
              <View style={styles.officerAlertHeader}>
                <MaterialIcons
                  name="warning"
                  size={18}
                  color={
                    alert.severity === 'critical'
                      ? Theme.colors.reject
                      : alert.severity === 'high'
                      ? Theme.colors.caution
                      : '#F57F17'
                  }
                />
                <Text style={styles.officerAlertTitle}>{alert.title}</Text>
              </View>
              <Text style={styles.officerAlertDesc}>{alert.desc}</Text>
              <View style={styles.alertFooter}>
                <Text style={styles.alertTime}>{alert.time}</Text>
                <TouchableOpacity
                  style={styles.notifyBtn}
                  onPress={() => showToast('Dispatched advisory notification to field teams')}>
                  <Text style={styles.notifyBtnText}>Dispatch Warning</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {role === 'farmer' ? renderFarmerHome() : renderOfficerDashboard()}
      </ScrollView>

      {/* Floating Microphone Action Button for Farmer (2s listening -> test feed) */}
      {role === 'farmer' && (
        <TouchableOpacity
          style={styles.floatingMicBtn}
          onPress={() => startListening(() => router.push('/test-flow'))}
          activeOpacity={0.85}>
          <MaterialIcons name="mic" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  greetingCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  farmerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  farmSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  farmSubText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  herdBadge: {
    backgroundColor: Theme.colors.primarySurface,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  herdBadgeCount: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  herdBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
    textTransform: 'uppercase',
  },
  actionsSection: {
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  bigActionGrid: {
    gap: 10,
  },
  bigActionCard: {
    borderRadius: Theme.radius.lg,
    padding: 16,
    borderWidth: 1.5,
    minHeight: 76,
    position: 'relative',
    ...Theme.shadows.soft,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 3,
  },
  actionSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  actionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  alertsStripContainer: {
    backgroundColor: '#FFF5F2',
    borderRadius: Theme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FFCCBC',
    marginBottom: 16,
  },
  stripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  stripHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#BF360C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: Theme.radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.reject,
  },
  alertItemText: {
    flex: 1,
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  statsCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 16,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  testCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  testCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  testSampleName: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  testBatchDate: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  testScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scorePillLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  scorePillVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  proteinPill: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    backgroundColor: Theme.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  moisturePill: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    backgroundColor: Theme.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  floatingMicBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.glow,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  // Officer Dashboard styles
  officerHeaderCard: {
    backgroundColor: '#37474F',
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  officerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  officerSub: {
    fontSize: 12,
    color: '#CFD8DC',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  heatmapGrid: {
    gap: 8,
  },
  heatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
  },
  heatBlockName: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  heatAdulteration: {
    fontSize: 14,
    fontWeight: '800',
  },
  heatTestsCount: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingRight: 10,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 10,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.textSecondary,
  },
  supName: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  supLoc: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  supScoreBox: {
    alignItems: 'flex-end',
  },
  supScore: {
    fontSize: 14,
    fontWeight: '800',
  },
  supGrade: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.colors.textMuted,
  },
  officerAlertCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: Theme.radius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFF176',
  },
  officerAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  officerAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5D4037',
  },
  officerAlertDesc: {
    fontSize: 12,
    color: '#4E342E',
    lineHeight: 16,
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 11,
    color: '#8D6E63',
  },
  notifyBtn: {
    backgroundColor: Theme.colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  notifyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
