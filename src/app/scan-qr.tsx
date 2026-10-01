import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.72;

export default function ScanQrScreen() {
  const { t } = useApp();

  const [scanState, setScanState] = useState<'scanning' | 'verified' | 'suspicious'>('scanning');
  const [scanCount, setScanCount] = useState<number>(0);
  const [torchOn, setTorchOn] = useState(false);

  // Laser scanner animation
  const laserY = useSharedValue(10);

  useEffect(() => {
    laserY.value = withRepeat(
      withTiming(SCAN_SIZE - 20, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [laserY]);

  const laserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }],
  }));

  // Auto-resolve after 2.5 seconds
  useEffect(() => {
    if (scanState === 'scanning') {
      const timer = setTimeout(() => {
        try {
          Haptics.notificationAsync(
            scanCount % 2 === 0
              ? Haptics.NotificationFeedbackType.Success
              : Haptics.NotificationFeedbackType.Warning
          );
        } catch {}

        if (scanCount % 2 === 0) {
          setScanState('verified');
        } else {
          setScanState('suspicious');
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [scanState, scanCount]);

  const handleScanAnother = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setScanCount((prev) => prev + 1);
    setScanState('scanning');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <MaterialIcons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FeedScan QR Authenticator</Text>
        <TouchableOpacity
          style={[styles.iconBtn, torchOn && styles.torchActive]}
          onPress={() => setTorchOn(!torchOn)}>
          <MaterialIcons
            name={torchOn ? 'flash-on' : 'flash-off'}
            size={24}
            color={torchOn ? '#FFD54F' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerBody}>
        {scanState === 'scanning' ? (
          <>
            {/* Instruction */}
            <Text style={styles.instructionText}>
              Align FeedScan QR code on cattle feed sack within frame
            </Text>

            {/* Viewfinder Target Frame */}
            <View style={[styles.viewfinderTarget, { width: SCAN_SIZE, height: SCAN_SIZE }]}>
              {/* 4 Corner reticles */}
              <View style={[styles.reticleCorner, styles.cTL]} />
              <View style={[styles.reticleCorner, styles.cTR]} />
              <View style={[styles.reticleCorner, styles.cBL]} />
              <View style={[styles.reticleCorner, styles.cBR]} />

              {/* Animated Laser Beam */}
              <Animated.View style={[styles.laserBeam, laserStyle]} />
            </View>

            <View style={styles.verifyingPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.verifyingText}>Scanning offline batch registry...</Text>
            </View>
          </>
        ) : scanState === 'verified' ? (
          /* Card: Verified Authentic */
          <View style={styles.resultCard}>
            <View style={styles.resultBadgeRow}>
              <View style={styles.verifiedIconCircle}>
                <MaterialIcons name="verified-user" size={36} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultHeading}>{t('verifiedAuthentic')}</Text>
                <Text style={styles.resultSub}>Digital Signature Matched</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Batch ID:</Text>
                <Text style={styles.detailValue}>AML-0922-A</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Supplier:</Text>
                <Text style={styles.detailValue}>Kaira Milk Union (Amul)</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Feed Variety:</Text>
                <Text style={styles.detailValue}>Amul Dan Balanced Feed 20</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quality Score:</Text>
                <Text style={[styles.detailValue, { color: Theme.colors.safe }]}>
                  94 / 100 (Safe)
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Manufacturing Date:</Text>
                <Text style={styles.detailValue}>24 Sep 2026</Text>
              </View>
            </View>

            <View style={styles.resultActionsRow}>
              <TouchableOpacity
                style={styles.scanAnotherBtn}
                onPress={handleScanAnother}
                activeOpacity={0.85}>
                <MaterialIcons name="qr-code-scanner" size={18} color="#FFFFFF" />
                <Text style={styles.scanAnotherBtnText}>Scan Another</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ledgerBtn}
                onPress={() => router.push('/traceability')}
                activeOpacity={0.85}>
                <Text style={styles.ledgerBtnText}>View Timeline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Card: Suspicious / Untracked */
          <View style={[styles.resultCard, { borderColor: Theme.colors.rejectBorder }]}>
            <View style={styles.resultBadgeRow}>
              <View style={[styles.verifiedIconCircle, { backgroundColor: Theme.colors.reject }]}>
                <MaterialIcons name="gpp-bad" size={36} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultHeading, { color: Theme.colors.reject }]}>
                  {t('suspiciousBatch')}
                </Text>
                <Text style={styles.resultSub}>No cryptographic signature in registry</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.warningDesc}>
                WARNING: This feed bag QR code is NOT registered with Amul or any authorized district dairy cooperative. High risk of counterfeit or adulterated filler mash.
              </Text>
              <View style={styles.flagBox}>
                <MaterialIcons name="report" size={16} color={Theme.colors.reject} />
                <Text style={styles.flagText}>Recommendation: Quarantine bag and do not feed</Text>
              </View>
            </View>

            <View style={styles.resultActionsRow}>
              <TouchableOpacity
                style={[styles.scanAnotherBtn, { backgroundColor: Theme.colors.reject }]}
                onPress={handleScanAnother}
                activeOpacity={0.85}>
                <MaterialIcons name="replay" size={18} color="#FFFFFF" />
                <Text style={styles.scanAnotherBtnText}>Scan Another</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ledgerBtn}
                onPress={() => router.push('/traceability')}
                activeOpacity={0.85}>
                <Text style={styles.ledgerBtnText}>Traceability Ledger</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F1710',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchActive: {
    backgroundColor: 'rgba(255, 213, 79, 0.3)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scannerBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#ECEFF1',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  viewfinderTarget: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  reticleCorner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#00E676',
  },
  cTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  cTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  cBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  cBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  laserBeam: {
    height: 3,
    backgroundColor: '#00E676',
    width: '100%',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  verifyingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.full,
    marginTop: 32,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  verifyingText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.radius.xl,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    borderWidth: 2,
    borderColor: Theme.colors.safeBorder,
    ...Theme.shadows.glow,
  },
  resultBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  verifiedIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Theme.colors.safe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.safe,
  },
  resultSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  detailsContainer: {
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    padding: 14,
    gap: 8,
    marginBottom: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  warningDesc: {
    fontSize: 13,
    color: Theme.colors.reject,
    lineHeight: 18,
    fontWeight: '600',
  },
  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.rejectSurface,
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  flagText: {
    fontSize: 11,
    color: Theme.colors.reject,
    fontWeight: '700',
    flex: 1,
  },
  resultActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scanAnotherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.radius.md,
  },
  scanAnotherBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ledgerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingVertical: 14,
    borderRadius: Theme.radius.md,
  },
  ledgerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
  },
});
