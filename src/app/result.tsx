import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import VerdictBadge from '../components/VerdictBadge';
import ScoreRing from '../components/ScoreRing';
import NutritionGauge from '../components/NutritionGauge';
import * as Haptics from 'expo-haptics';

export default function ResultScreen() {
  const { currentResult, showToast, t } = useApp();

  // Voice advisory audio playback simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // QR Modal
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Audio waveform animation
  const wave1 = useSharedValue(12);
  const wave2 = useSharedValue(24);
  const wave3 = useSharedValue(18);
  const wave4 = useSharedValue(30);

  useEffect(() => {
    if (isPlayingAudio) {
      wave1.value = withRepeat(
        withSequence(withTiming(32, { duration: 250 }), withTiming(10, { duration: 250 })),
        -1,
        true
      );
      wave2.value = withRepeat(
        withSequence(withTiming(14, { duration: 300 }), withTiming(38, { duration: 300 })),
        -1,
        true
      );
      wave3.value = withRepeat(
        withSequence(withTiming(36, { duration: 280 }), withTiming(12, { duration: 280 })),
        -1,
        true
      );
      wave4.value = withRepeat(
        withSequence(withTiming(16, { duration: 260 }), withTiming(34, { duration: 260 })),
        -1,
        true
      );

      const timer = setTimeout(() => {
        setIsPlayingAudio(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isPlayingAudio, wave1, wave2, wave3, wave4]);

  const waveStyle1 = useAnimatedStyle(() => ({ height: wave1.value }));
  const waveStyle2 = useAnimatedStyle(() => ({ height: wave2.value }));
  const waveStyle3 = useAnimatedStyle(() => ({ height: wave3.value }));
  const waveStyle4 = useAnimatedStyle(() => ({ height: wave4.value }));

  const handlePlayAudio = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setIsPlayingAudio(true);
  };

  const handleSaveToBatch = () => {
    showToast(`Batch ${currentResult.batchNumber} saved to storage registry!`);
  };

  const handleShareReport = () => {
    showToast('Quality report generated and ready to share via WhatsApp');
  };

  const handleReportSupplier = () => {
    showToast(`Supplier incident flagged: ${currentResult.brandName}`);
  };

  const handleRetest = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.replace('/test-flow');
  };

  const qrDataString = `FEEDSCAN:CERT:${currentResult.id}:BATCH:${currentResult.batchNumber}:VERDICT:${currentResult.verdict}:SCORE:${currentResult.score}:DATE:${currentResult.testDate}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}>
          <MaterialIcons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feed Quality Analysis</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareReport}>
          <MaterialIcons name="share" size={22} color={Theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Sample Identity Strip */}
        <View style={styles.identityCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sampleTitle}>{currentResult.sampleName}</Text>
            <Text style={styles.batchSub}>
              Batch #{currentResult.batchNumber} • {currentResult.brandName}
            </Text>
            <Text style={styles.dateSub}>Tested on: {currentResult.testDate}</Text>
          </View>
          <View style={styles.confidenceChip}>
            <MaterialIcons name="verified" size={14} color={Theme.colors.primary} />
            <Text style={styles.confidenceText}>{t('aiConfidence')}</Text>
          </View>
        </View>

        {/* Hero Verdict & Score Ring Card */}
        <View style={styles.verdictHeroCard}>
          <View style={styles.verdictTopRow}>
            <VerdictBadge verdict={currentResult.verdict} size="lg" />
          </View>

          <View style={styles.scoreRow}>
            <ScoreRing
              score={currentResult.score}
              verdict={currentResult.verdict}
              size={136}
              strokeWidth={13}
            />

            <View style={styles.summaryStatsBox}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>Moisture</Text>
                <Text style={styles.summaryStatVal}>
                  {currentResult.metrics.moisture.value}%
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>Crude Protein</Text>
                <Text style={styles.summaryStatVal}>
                  {currentResult.metrics.protein.value}%
                </Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatLabel}>Adulteration</Text>
                <Text
                  style={[
                    styles.summaryStatVal,
                    {
                      color:
                        currentResult.verdict === 'REJECT'
                          ? Theme.colors.reject
                          : currentResult.verdict === 'CAUTION'
                          ? Theme.colors.caution
                          : Theme.colors.safe,
                    },
                  ]}>
                  {currentResult.verdict === 'REJECT'
                    ? 'High Urea'
                    : currentResult.verdict === 'CAUTION'
                    ? 'Fungal/Moist'
                    : 'Clean Pure'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Veterinary Advisory Card with Translated Concrete Steps */}
        <View style={styles.advisoryCard}>
          <View style={styles.advisoryHeaderRow}>
            <View style={styles.advisoryIconCircle}>
              <MaterialIcons name="health-and-safety" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.advisoryTitle}>{t('advisoryHeader')}</Text>
              <Text style={styles.advisoryLangNote}>Actionable Protocol for Dairy Herd</Text>
            </View>
          </View>

          {/* Translated Advisory Content */}
          <Text style={styles.advisoryBodyText}>
            {t(currentResult.advisoryKey)}
          </Text>

          {/* Audio Waveform Player Simulation */}
          <View style={styles.audioPlayerContainer}>
            {!isPlayingAudio ? (
              <TouchableOpacity
                style={styles.listenAudioBtn}
                onPress={handlePlayAudio}
                activeOpacity={0.85}>
                <MaterialIcons name="volume-up" size={20} color="#FFFFFF" />
                <Text style={styles.listenAudioText}>{t('listenAudio')}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.audioPlayingBox}>
                <View style={styles.waveformRow}>
                  <Animated.View style={[styles.audioWaveBar, waveStyle1]} />
                  <Animated.View style={[styles.audioWaveBar, waveStyle2]} />
                  <Animated.View style={[styles.audioWaveBar, waveStyle3]} />
                  <Animated.View style={[styles.audioWaveBar, waveStyle4]} />
                </View>
                <Text style={styles.audioPlayingText}>{t('playingAudio')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Nutritional Gauges with Target Ranges */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('nutritionGaugesTitle')}</Text>
          <NutritionGauge metric={currentResult.metrics.protein} />
          <NutritionGauge metric={currentResult.metrics.moisture} />
          <NutritionGauge metric={currentResult.metrics.fibre} />
          <NutritionGauge metric={currentResult.metrics.energy} />
        </View>

        {/* Safety & Contaminants Check Chips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('contaminantsTitle')}</Text>
          <View style={styles.contaminantsGrid}>
            {currentResult.contaminants.map((item, idx) => {
              const isCrit = item.severity === 'critical';
              const isHigh = item.severity === 'high';

              const bg = isCrit
                ? Theme.colors.rejectSurface
                : isHigh
                ? Theme.colors.cautionSurface
                : Theme.colors.safeSurface;
              const border = isCrit
                ? Theme.colors.rejectBorder
                : isHigh
                ? Theme.colors.cautionBorder
                : Theme.colors.safeBorder;
              const textColor = isCrit
                ? Theme.colors.reject
                : isHigh
                ? Theme.colors.caution
                : Theme.colors.safe;

              return (
                <View
                  key={idx}
                  style={[
                    styles.contaminantChip,
                    { backgroundColor: bg, borderColor: border },
                  ]}>
                  <MaterialIcons
                    name={item.isSafe ? 'check-circle' : 'warning'}
                    size={16}
                    color={textColor}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contaminantParamName}>
                      {t(item.nameKey)}
                    </Text>
                    <Text style={[styles.contaminantVal, { color: textColor }]}>
                      {item.valueText}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Minerals Row */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('mineralsTitle')}</Text>
          <View style={styles.mineralsRow}>
            <View style={styles.mineralBox}>
              <Text style={styles.mineralLabel}>{t('calciumLabel')}</Text>
              <Text style={styles.mineralValue}>{currentResult.minerals.calcium}</Text>
            </View>
            <View style={styles.mineralBox}>
              <Text style={styles.mineralLabel}>{t('phosphorusLabel')}</Text>
              <Text style={styles.mineralValue}>{currentResult.minerals.phosphorus}</Text>
            </View>
            <View style={styles.mineralBox}>
              <Text style={styles.mineralLabel}>Magnesium (Mg)</Text>
              <Text style={styles.mineralValue}>{currentResult.minerals.magnesium}</Text>
            </View>
          </View>
        </View>

        {/* 5 Bottom Action Buttons */}
        <View style={styles.actionsGrid}>
          {/* Action 1: Save to Batch */}
          <TouchableOpacity
            style={styles.actionButtonSecondary}
            onPress={handleSaveToBatch}
            activeOpacity={0.8}>
            <MaterialIcons name="save" size={20} color={Theme.colors.primaryDark} />
            <Text style={styles.actionButtonSecondaryText}>{t('saveToBatch')}</Text>
          </TouchableOpacity>

          {/* Action 2: Generate QR */}
          <TouchableOpacity
            style={styles.actionButtonPrimary}
            onPress={() => setQrModalVisible(true)}
            activeOpacity={0.85}>
            <MaterialIcons name="qr-code" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonPrimaryText}>{t('generateQR')}</Text>
          </TouchableOpacity>

          {/* Action 3: Retest */}
          <TouchableOpacity
            style={styles.actionButtonSecondary}
            onPress={handleRetest}
            activeOpacity={0.8}>
            <MaterialIcons name="replay" size={20} color={Theme.colors.textSecondary} />
            <Text style={[styles.actionButtonSecondaryText, { color: Theme.colors.textSecondary }]}>
              {t('retestSample')}
            </Text>
          </TouchableOpacity>

          {/* Action 4: Report Supplier */}
          <TouchableOpacity
            style={[styles.actionButtonSecondary, { borderColor: Theme.colors.rejectBorder }]}
            onPress={handleReportSupplier}
            activeOpacity={0.8}>
            <MaterialIcons name="report-problem" size={20} color={Theme.colors.reject} />
            <Text style={[styles.actionButtonSecondaryText, { color: Theme.colors.reject }]}>
              {t('reportSupplier')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR Code Modal Dialog */}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setQrModalVisible(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FeedScan Batch Certificate</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <MaterialIcons name="close" size={22} color={Theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrWrapper}>
              <QRCode
                value={qrDataString}
                size={180}
                color="#1A2419"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text style={styles.qrBatchText}>Batch: {currentResult.batchNumber}</Text>
            <Text style={styles.qrVerdictText}>
              Status: {currentResult.verdict} ({currentResult.score}/100)
            </Text>
            <Text style={styles.qrSubText}>
              Scan this QR code with any FeedScan device to verify authenticity offline.
            </Text>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => {
                setQrModalVisible(false);
                showToast('Batch QR Certificate saved to device');
              }}>
              <Text style={styles.modalCloseBtnText}>Save QR to Farm Ledger</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  shareButton: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  identityCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  sampleTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 3,
  },
  batchSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginBottom: 2,
  },
  dateSub: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginBottom: 8,
  },
  confidenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  verdictHeroCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  verdictTopRow: {
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  summaryStatsBox: {
    flex: 1,
    gap: 8,
  },
  summaryStatItem: {
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  summaryStatVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.text,
    marginTop: 1,
  },
  advisoryCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    ...Theme.shadows.soft,
  },
  advisoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  advisoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisoryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E65100',
  },
  advisoryLangNote: {
    fontSize: 11,
    color: '#8D6E63',
  },
  advisoryBodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#3E2723',
    fontWeight: '600',
    marginBottom: 14,
  },
  audioPlayerContainer: {
    marginTop: 4,
  },
  listenAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Theme.radius.full,
    alignSelf: 'flex-start',
  },
  listenAudioText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  audioPlayingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFE082',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Theme.radius.md,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 38,
  },
  audioWaveBar: {
    width: 4,
    backgroundColor: '#E65100',
    borderRadius: 2,
  },
  audioPlayingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BF360C',
  },
  sectionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 14,
  },
  contaminantsGrid: {
    gap: 8,
  },
  contaminantChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
  },
  contaminantParamName: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  contaminantVal: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  mineralsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mineralBox: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  mineralLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  mineralValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  actionButtonPrimary: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.radius.md,
    minHeight: 52,
    ...Theme.shadows.glow,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionButtonSecondary: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.surface,
    paddingVertical: 14,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    minHeight: 52,
    ...Theme.shadows.soft,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.radius.xl,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...Theme.shadows.glow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    marginBottom: 16,
    ...Theme.shadows.soft,
  },
  qrBatchText: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  qrVerdictText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
    marginBottom: 8,
  },
  qrSubText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: Theme.radius.full,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
