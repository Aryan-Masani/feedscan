import React, { useState } from 'react';
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
import QRCode from 'react-native-qrcode-svg';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { BATCHES_LIST } from '../data/demo';
import VerdictBadge from '../components/VerdictBadge';
import * as Haptics from 'expo-haptics';

export default function TraceabilityScreen() {
  const { t, showToast } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState<string>(BATCHES_LIST[0].id);

  const selectedBatch =
    BATCHES_LIST.find((b) => b.id === selectedBatchId) || BATCHES_LIST[0];

  const handleSelectBatch = (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSelectedBatchId(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('traceabilityTitle')}</Text>
        <TouchableOpacity
          style={styles.scannerLinkBtn}
          onPress={() => router.push('/scan-qr')}>
          <MaterialIcons name="qr-code-scanner" size={22} color={Theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Horizontal Batch Picker Carousel */}
        <Text style={styles.sectionHeading}>Registered Farm Batches</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.batchCardsRow}>
          {BATCHES_LIST.map((batch) => {
            const isSelected = batch.id === selectedBatchId;
            return (
              <TouchableOpacity
                key={batch.id}
                style={[
                  styles.batchItemCard,
                  isSelected && styles.batchItemCardActive,
                ]}
                onPress={() => handleSelectBatch(batch.id)}
                activeOpacity={0.85}>
                <View style={styles.batchCardTop}>
                  <Text style={styles.batchNumberText}>#{batch.batchNumber}</Text>
                  <VerdictBadge verdict={batch.status} size="sm" />
                </View>
                <Text style={styles.batchFeedType} numberOfLines={1}>
                  {batch.feedType}
                </Text>
                <Text style={styles.batchSupplierSub} numberOfLines={1}>
                  {batch.supplier}
                </Text>
                <View style={styles.batchBagsRow}>
                  <Text style={styles.batchBagsText}>{batch.bags} Bags</Text>
                  <Text style={styles.batchScoreText}>Score {batch.score}/100</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Batch QR Certificate Card */}
        {selectedBatch && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailBatchNum}>
                  Batch #{selectedBatch.batchNumber}
                </Text>
                <Text style={styles.detailSupplier}>{selectedBatch.supplier}</Text>
              </View>
              <VerdictBadge verdict={selectedBatch.status} size="md" />
            </View>

            {/* Real SVG QR Code */}
            <View style={styles.qrContainer}>
              <View style={styles.qrInner}>
                <QRCode
                  value={selectedBatch.qrPayload}
                  size={160}
                  color="#1A2419"
                  backgroundColor="#FFFFFF"
                />
              </View>
              <Text style={styles.qrMetaText}>
                Payload: {selectedBatch.batchNumber} • Score: {selectedBatch.score}/100
              </Text>
            </View>

            {/* Supply Chain Timeline (Source -> Tested -> Stored -> Dispatched) */}
            <View style={styles.timelineSection}>
              <Text style={styles.timelineSectionTitle}>Supply Chain Audit Trail</Text>

              {selectedBatch.timeline.map((step, idx) => (
                <View key={step.stage} style={styles.timelineStepRow}>
                  {/* Left indicator with connector */}
                  <View style={styles.timelineIndicatorColumn}>
                    <View
                      style={[
                        styles.timelineCheckCircle,
                        step.done && styles.timelineCheckDone,
                      ]}>
                      <MaterialIcons
                        name={step.done ? 'check' : 'hourglass-empty'}
                        size={12}
                        color={step.done ? '#FFFFFF' : Theme.colors.textMuted}
                      />
                    </View>
                    {idx < selectedBatch.timeline.length - 1 && (
                      <View
                        style={[
                          styles.timelineVerticalLine,
                          step.done && styles.timelineVerticalLineDone,
                        ]}
                      />
                    )}
                  </View>

                  {/* Stage text */}
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineStageHeader}>
                      <Text style={styles.timelineStageName}>{step.stage}</Text>
                      <Text style={styles.timelineDate}>{step.date}</Text>
                    </View>
                    <Text style={styles.timelineDetail}>{step.detail}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.shareLedgerBtn}
                onPress={() => showToast('Batch certificate exported to storage PDF')}
                activeOpacity={0.85}>
                <MaterialIcons name="download" size={18} color="#FFFFFF" />
                <Text style={styles.shareLedgerBtnText}>Download Audit Certificate</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
  scannerLinkBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  batchCardsRow: {
    gap: 12,
    paddingBottom: 16,
  },
  batchItemCard: {
    width: 220,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  batchItemCardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySurface,
  },
  batchCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  batchNumberText: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  batchFeedType: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  batchSupplierSub: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 10,
  },
  batchBagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  batchBagsText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  batchScoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  detailCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
    marginBottom: 30,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailBatchNum: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.colors.text,
  },
  detailSupplier: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  qrInner: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...Theme.shadows.soft,
  },
  qrMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginTop: 10,
  },
  timelineSection: {
    marginBottom: 20,
  },
  timelineSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 14,
  },
  timelineStepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineIndicatorColumn: {
    alignItems: 'center',
    width: 20,
  },
  timelineCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CFD8DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCheckDone: {
    backgroundColor: Theme.colors.primary,
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CFD8DC',
    marginVertical: 4,
    minHeight: 28,
  },
  timelineVerticalLineDone: {
    backgroundColor: Theme.colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 14,
  },
  timelineStageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timelineStageName: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  timelineDate: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  timelineDetail: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  buttonRow: {
    marginTop: 4,
  },
  shareLedgerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.full,
    paddingVertical: 14,
    minHeight: 52,
  },
  shareLedgerBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
