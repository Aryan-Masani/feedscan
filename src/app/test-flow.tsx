import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import {
  SAMPLE_TYPES,
  SampleType,
  SCRIPTED_RESULTS,
} from '../data/demo';
import FeedSampleSvg from '../components/FeedSampleSvg';
import * as Haptics from 'expo-haptics';

export default function TestFlowScreen() {
  const {
    selectedSampleType,
    setSelectedSampleType,
    setCurrentResult,
    addTestResult,
    t,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(0);
  // 0: Sample Type, 1: Capture, 2: Sensor Kit, 3: Strips, 4: Analyzing

  // Sensor kit state
  const [isPairing, setIsPairing] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const currentScripted = SCRIPTED_RESULTS[selectedSampleType];
  const [probeReadings, setProbeReadings] = useState({
    moisture: currentScripted?.sensorKitReadings?.moisture || 11.8,
    ph: currentScripted?.sensorKitReadings?.ph || 6.4,
    temp: currentScripted?.sensorKitReadings?.temperature || 31.2,
  });

  const handleSelectSample = (sampleId: SampleType) => {
    setSelectedSampleType(sampleId);
    const s = SCRIPTED_RESULTS[sampleId];
    if (s?.sensorKitReadings) {
      setProbeReadings({
        moisture: s.sensorKitReadings.moisture,
        ph: s.sensorKitReadings.ph,
        temp: s.sensorKitReadings.temperature,
      });
    }
  };

  // Strip scanning states
  const [ureaScanned, setUreaScanned] = useState(false);
  const [aflatoxinScanned, setAflatoxinScanned] = useState(false);

  // Analysis checklist progress
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState([false, false, false, false]);

  // Flash animation for camera capture
  const flashOpacity = useSharedValue(0);

  // Gentle live fluctuation of probe values when connected
  useEffect(() => {
    let interval: any;
    if (isPaired) {
      interval = setInterval(() => {
        setProbeReadings((prev) => ({
          moisture: +(prev.moisture + (Math.random() * 0.4 - 0.2)).toFixed(1),
          ph: +(prev.ph + (Math.random() * 0.04 - 0.02)).toFixed(2),
          temp: +(prev.temp + (Math.random() * 0.2 - 0.1)).toFixed(1),
        }));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPaired]);

  // Step 4: 4-second automated checklist execution
  useEffect(() => {
    if (currentStep === 4) {
      const t0 = setTimeout(() => {
        setCheckedSteps([false, false, false, false]);
        setAnalysisProgress(0);
      }, 10);

      const t1 = setTimeout(() => {
        setAnalysisProgress(28);
        setCheckedSteps([true, false, false, false]);
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
      }, 900);

      const t2 = setTimeout(() => {
        setAnalysisProgress(56);
        setCheckedSteps([true, true, false, false]);
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
      }, 1900);

      const t3 = setTimeout(() => {
        setAnalysisProgress(82);
        setCheckedSteps([true, true, true, false]);
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {}
      }, 2900);

      const t4 = setTimeout(() => {
        setAnalysisProgress(100);
        setCheckedSteps([true, true, true, true]);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}

        // Complete & Navigate to Result Screen
        setTimeout(() => {
          const resultData = {
            ...SCRIPTED_RESULTS[selectedSampleType],
            id: `RES-${selectedSampleType.toUpperCase()}-${Date.now()}`,
            testDate: 'Just now',
          };
          setCurrentResult(resultData);
          addTestResult(resultData);
          router.replace('/result');
        }, 800);
      }, 3900);

      return () => {
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [currentStep, selectedSampleType, addTestResult, setCurrentResult]);

  const handleCapturePhoto = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}

    // Camera flash effect
    flashOpacity.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withTiming(0, { duration: 250 })
    );

    setTimeout(() => {
      setCurrentStep(2); // Go to Sensor Kit step
    }, 400);
  };

  const handleConnectProbe = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      setIsPaired(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }, 1100);
  };

  const handleScanUreaStrip = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setTimeout(() => {
      setUreaScanned(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }, 700);
  };

  const handleScanAflatoxinStrip = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setTimeout(() => {
      setAflatoxinScanned(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
    }, 700);
  };

  const flashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const stepsList = [
    { title: t('stepSampleType'), icon: 'grain' },
    { title: t('stepCapture'), icon: 'photo-camera' },
    { title: t('stepSensors'), icon: 'sensors' },
    { title: t('stepStrips'), icon: 'colorize' },
    { title: t('stepAnalysis'), icon: 'analytics' },
  ];

  const currentSampleInfo =
    SAMPLE_TYPES.find((s) => s.id === selectedSampleType) || SAMPLE_TYPES[0];
  const scripted = SCRIPTED_RESULTS[selectedSampleType];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Camera Flash Overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.flashOverlay, flashAnimatedStyle]}
      />

      {/* Top Wizard Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (currentStep > 0 && currentStep < 4) {
              setCurrentStep(currentStep - 1);
            } else {
              router.back();
            }
          }}>
          <MaterialIcons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.topNavTitleBox}>
          <Text style={styles.wizardTitle}>{t('testWizardTitle')}</Text>
          <Text style={styles.wizardStepSub}>
            Step {currentStep + 1} of 5: {stepsList[currentStep].title}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={Theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Stepper Progress Bar */}
      <View style={styles.stepperContainer}>
        {stepsList.map((step, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <View key={step.title} style={styles.stepIndicatorWrapper}>
              <View
                style={[
                  styles.stepDot,
                  isActive && styles.stepDotActive,
                  isDone && styles.stepDotDone,
                ]}>
                {isDone ? (
                  <MaterialIcons name="check" size={12} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.stepDotNumber,
                      isActive && styles.stepDotNumberActive,
                    ]}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              {idx < stepsList.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    isDone && styles.stepLineDone,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ================= STEP 0: SAMPLE TYPE SELECTION ================= */}
        {currentStep === 0 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>{t('chooseSampleHeader')}</Text>
            <Text style={styles.stepDescription}>{t('chooseSampleSub')}</Text>

            <View style={styles.sampleGrid}>
              {SAMPLE_TYPES.map((sample) => {
                const isSelected = selectedSampleType === sample.id;
                return (
                  <TouchableOpacity
                    key={sample.id}
                    style={[
                      styles.sampleCard,
                      isSelected && styles.sampleCardSelected,
                    ]}
                    onPress={() => handleSelectSample(sample.id)}
                    activeOpacity={0.85}>
                    <View
                      style={[
                        styles.sampleIconCircle,
                        {
                          backgroundColor: isSelected
                            ? Theme.colors.primary
                            : Theme.colors.surfaceSubtle,
                        },
                      ]}>
                      <MaterialIcons
                        name={sample.icon as any}
                        size={26}
                        color={isSelected ? '#FFFFFF' : Theme.colors.primaryDark}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.sampleName}>{sample.name}</Text>
                      <Text style={styles.sampleHindi}>{sample.hindiName}</Text>
                      <Text style={styles.sampleDesc}>{sample.desc}</Text>
                      <View style={styles.benchmarksRow}>
                        <Text style={styles.benchmarkText}>
                          Protein: {sample.targetProtein}
                        </Text>
                        <Text style={styles.benchmarkText}>
                          H2O: {sample.targetMoisture}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => setCurrentStep(1)}
              activeOpacity={0.85}>
              <Text style={styles.primaryActionText}>
                {t('next')}: Camera Surface Scan
              </Text>
              <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 1: CAPTURE / VIEWFINDER ================= */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>{t('captureHeader')}</Text>
            <Text style={styles.stepDescription}>{t('captureTip')}</Text>

            {/* Viewfinder Frame with Procedural SVG */}
            <View style={styles.viewfinderFrame}>
              <View style={styles.viewfinderInner}>
                <FeedSampleSvg sampleType={selectedSampleType} isScanning={true} />

                {/* Corner reticle guides */}
                <View style={[styles.reticleCorner, styles.cornerTL]} />
                <View style={[styles.reticleCorner, styles.cornerTR]} />
                <View style={[styles.reticleCorner, styles.cornerBL]} />
                <View style={[styles.reticleCorner, styles.cornerBR]} />

                {/* Sample identification badge */}
                <View style={styles.viewfinderBadge}>
                  <Text style={styles.viewfinderBadgeText}>
                    {currentSampleInfo.name}
                  </Text>
                </View>
              </View>

              {/* Lighting Status Indicator */}
              <View style={styles.lightingRow}>
                <View style={styles.lightingPill}>
                  <View style={styles.greenLightDot} />
                  <Text style={styles.lightingText}>{t('lightingGood')}</Text>
                </View>
                <Text style={styles.exposureText}>Focus: Locked (ISO 100)</Text>
              </View>
            </View>

            {/* Big Capture Button with flash */}
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapturePhoto}
              activeOpacity={0.85}>
              <View style={styles.captureInnerCircle}>
                <MaterialIcons name="photo-camera" size={30} color="#FFFFFF" />
              </View>
              <Text style={styles.captureButtonText}>{t('captureButton')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 2: SENSOR PROBE KIT ================= */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>{t('sensorKitHeader')}</Text>
            <Text style={styles.stepDescription}>{t('sensorKitSub')}</Text>

            {/* Probe Connect Card */}
            <View style={styles.probeStatusCard}>
              {!isPaired ? (
                <View style={styles.unpairedBox}>
                  <MaterialIcons
                    name={isPairing ? 'bluetooth-searching' : 'bluetooth'}
                    size={48}
                    color={isPairing ? Theme.colors.accent : Theme.colors.textMuted}
                  />
                  <Text style={styles.unpairedTitle}>
                    {isPairing ? 'Pairing BLE Multi-Probe...' : 'Probe Not Connected'}
                  </Text>
                  <Text style={styles.unpairedSub}>
                    Hold FeedScan BLE Sensor Kit near feed core
                  </Text>

                  <TouchableOpacity
                    style={styles.connectProbeBtn}
                    onPress={handleConnectProbe}
                    disabled={isPairing}
                    activeOpacity={0.85}>
                    <MaterialIcons name="bluetooth-audio" size={20} color="#FFFFFF" />
                    <Text style={styles.connectProbeBtnText}>
                      {isPairing ? 'Connecting...' : t('connectKitBtn')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.pairedBox}>
                  <View style={styles.probeConnectedHeader}>
                    <MaterialIcons name="bluetooth-connected" size={22} color={Theme.colors.safe} />
                    <Text style={styles.probeConnectedText}>{t('connectedProbe')}</Text>
                    <View style={styles.liveChip}>
                      <Text style={styles.liveChipText}>LIVE</Text>
                    </View>
                  </View>

                  {/* 3 Live Fluctuation Probe Gauges */}
                  <View style={styles.readingsRow}>
                    <View style={styles.readingBox}>
                      <Text style={styles.readingParam}>Moisture</Text>
                      <Text style={styles.readingValue}>{probeReadings.moisture}%</Text>
                      <Text style={styles.readingState}>±0.2%</Text>
                    </View>
                    <View style={styles.readingBox}>
                      <Text style={styles.readingParam}>pH Value</Text>
                      <Text style={styles.readingValue}>{probeReadings.ph}</Text>
                      <Text style={styles.readingState}>±0.02</Text>
                    </View>
                    <View style={styles.readingBox}>
                      <Text style={styles.readingParam}>Temp</Text>
                      <Text style={styles.readingValue}>{probeReadings.temp}°C</Text>
                      <Text style={styles.readingState}>Stable</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => setCurrentStep(3)}
              activeOpacity={0.85}>
              <Text style={styles.primaryActionText}>
                {t('next')}: {t('stepStrips')}
              </Text>
              <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipLink}
              onPress={() => setCurrentStep(3)}>
              <Text style={styles.skipLinkText}>{t('skipProbe')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 3: TEST STRIPS SCAN ================= */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>{t('stripsHeader')}</Text>
            <Text style={styles.stepDescription}>{t('stripsSub')}</Text>

            {/* Strip 1: Urea Adulteration */}
            <View style={styles.stripCard}>
              <View style={styles.stripCardHeader}>
                <View>
                  <Text style={styles.stripTitle}>{t('ureaStripTitle')}</Text>
                  <Text style={styles.stripSub}>Enzymatic urease indicator</Text>
                </View>
                {ureaScanned && (
                  <View style={styles.scannedBadge}>
                    <MaterialIcons name="check-circle" size={16} color={Theme.colors.safe} />
                    <Text style={styles.scannedBadgeText}>Matched</Text>
                  </View>
                )}
              </View>

              {/* Reference color spectrum */}
              <View style={styles.stripSlotContainer}>
                <View style={styles.swatchSlot}>
                  <View
                    style={[
                      styles.colorSquare,
                      {
                        backgroundColor: ureaScanned
                          ? scripted.stripReadings?.ureaColor || '#880E4F'
                          : '#E0E0E0',
                      },
                    ]}
                  />
                  <Text style={styles.swatchResultLabel}>
                    {ureaScanned
                      ? scripted.stripReadings?.ureaReading
                      : 'Place strip in slot'}
                  </Text>
                </View>

                {!ureaScanned ? (
                  <TouchableOpacity
                    style={styles.scanStripBtn}
                    onPress={handleScanUreaStrip}
                    activeOpacity={0.85}>
                    <MaterialIcons name="camera" size={18} color="#FFFFFF" />
                    <Text style={styles.scanStripBtnText}>{t('scanStripBtn')}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.calibratedTag}>
                    <Text style={styles.calibratedTagText}>Calibrated</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Strip 2: Aflatoxin B1 */}
            <View style={styles.stripCard}>
              <View style={styles.stripCardHeader}>
                <View>
                  <Text style={styles.stripTitle}>{t('aflatoxinStripTitle')}</Text>
                  <Text style={styles.stripSub}>Immuno-chromatographic lateral flow</Text>
                </View>
                {aflatoxinScanned && (
                  <View style={styles.scannedBadge}>
                    <MaterialIcons name="check-circle" size={16} color={Theme.colors.safe} />
                    <Text style={styles.scannedBadgeText}>Matched</Text>
                  </View>
                )}
              </View>

              <View style={styles.stripSlotContainer}>
                <View style={styles.swatchSlot}>
                  <View
                    style={[
                      styles.colorSquare,
                      {
                        backgroundColor: aflatoxinScanned
                          ? scripted.stripReadings?.aflatoxinColor || '#FFF59D'
                          : '#E0E0E0',
                      },
                    ]}
                  />
                  <Text style={styles.swatchResultLabel}>
                    {aflatoxinScanned
                      ? scripted.stripReadings?.aflatoxinReading
                      : 'Place strip in slot'}
                  </Text>
                </View>

                {!aflatoxinScanned ? (
                  <TouchableOpacity
                    style={styles.scanStripBtn}
                    onPress={handleScanAflatoxinStrip}
                    activeOpacity={0.85}>
                    <MaterialIcons name="camera" size={18} color="#FFFFFF" />
                    <Text style={styles.scanStripBtnText}>{t('scanStripBtn')}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.calibratedTag}>
                    <Text style={styles.calibratedTagText}>Calibrated</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => setCurrentStep(4)}
              activeOpacity={0.85}>
              <Text style={styles.primaryActionText}>
                {t('next')}: Run Full Analysis
              </Text>
              <MaterialIcons name="analytics" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 4: ANALYZING CHECKLIST ================= */}
        {currentStep === 4 && (
          <View style={styles.analyzingWrapper}>
            <View style={styles.analyzingHeaderBox}>
              <View style={styles.analyzingIconRing}>
                <MaterialIcons name="psychology" size={38} color={Theme.colors.primary} />
              </View>
              <Text style={styles.analyzingTitle}>{t('analyzingFeed')}</Text>
              <Text style={styles.analyzingSampleSub}>
                Evaluating {currentSampleInfo.name} ({currentSampleInfo.hindiName})
              </Text>
            </View>

            {/* Overall Progress Bar */}
            <View style={styles.overallBarContainer}>
              <View
                style={[
                  styles.overallBarFill,
                  { width: `${analysisProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentText}>{analysisProgress}% Complete</Text>

            {/* 4 Animated Checkpoints */}
            <View style={styles.checklistCard}>
              {/* Item 1 */}
              <View style={styles.checkItemRow}>
                <View
                  style={[
                    styles.checkCircle,
                    checkedSteps[0] && styles.checkCircleActive,
                  ]}>
                  {checkedSteps[0] ? (
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <View style={styles.checkDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.checkItemText,
                    checkedSteps[0] && styles.checkItemTextActive,
                  ]}>
                  {t('analysisStep1')}
                </Text>
              </View>

              {/* Item 2 */}
              <View style={styles.checkItemRow}>
                <View
                  style={[
                    styles.checkCircle,
                    checkedSteps[1] && styles.checkCircleActive,
                  ]}>
                  {checkedSteps[1] ? (
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <View style={styles.checkDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.checkItemText,
                    checkedSteps[1] && styles.checkItemTextActive,
                  ]}>
                  {t('analysisStep2')}
                </Text>
              </View>

              {/* Item 3 */}
              <View style={styles.checkItemRow}>
                <View
                  style={[
                    styles.checkCircle,
                    checkedSteps[2] && styles.checkCircleActive,
                  ]}>
                  {checkedSteps[2] ? (
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <View style={styles.checkDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.checkItemText,
                    checkedSteps[2] && styles.checkItemTextActive,
                  ]}>
                  {t('analysisStep3')}
                </Text>
              </View>

              {/* Item 4 */}
              <View style={styles.checkItemRow}>
                <View
                  style={[
                    styles.checkCircle,
                    checkedSteps[3] && styles.checkCircleActive,
                  ]}>
                  {checkedSteps[3] ? (
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  ) : (
                    <View style={styles.checkDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.checkItemText,
                    checkedSteps[3] && styles.checkItemTextActive,
                  ]}>
                  {t('analysisStep4')}
                </Text>
              </View>
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
  flashOverlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  backButton: {
    padding: 6,
  },
  topNavTitleBox: {
    alignItems: 'center',
  },
  wizardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  wizardStepSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  closeButton: {
    padding: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAECE4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: Theme.colors.primary,
    transform: [{ scale: 1.15 }],
  },
  stepDotDone: {
    backgroundColor: Theme.colors.primaryDark,
  },
  stepDotNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.textMuted,
  },
  stepDotNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 38,
    height: 3,
    backgroundColor: '#EAECE4',
    marginHorizontal: 4,
  },
  stepLineDone: {
    backgroundColor: Theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stepContainer: {},
  stepHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  sampleGrid: {
    gap: 10,
    marginBottom: 20,
  },
  sampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    gap: 12,
    ...Theme.shadows.soft,
  },
  sampleCardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primarySurface,
  },
  sampleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleName: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  sampleHindi: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.primaryDark,
    marginBottom: 2,
  },
  sampleDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  benchmarksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  benchmarkText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Theme.colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.full,
    paddingVertical: 16,
    minHeight: 56,
    gap: 10,
    ...Theme.shadows.glow,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Step 1: Capture
  viewfinderFrame: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    marginBottom: 20,
    ...Theme.shadows.card,
  },
  viewfinderInner: {
    height: 280,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  reticleCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#00E676',
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  viewfinderBadge: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewfinderBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  lightingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  lightingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  greenLightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.safe,
  },
  lightingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.safe,
  },
  exposureText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primaryDark,
    borderRadius: Theme.radius.full,
    paddingVertical: 14,
    minHeight: 56,
    gap: 12,
    ...Theme.shadows.glow,
  },
  captureInnerCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Step 2: Sensor Kit
  probeStatusCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    marginBottom: 20,
    ...Theme.shadows.soft,
  },
  unpairedBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  unpairedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.text,
    marginTop: 10,
  },
  unpairedSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  connectProbeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Theme.radius.full,
  },
  connectProbeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pairedBox: {
    paddingVertical: 8,
  },
  probeConnectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  probeConnectedText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.safe,
    flex: 1,
  },
  liveChip: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveChipText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#C62828',
  },
  readingsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  readingBox: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  readingParam: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  readingValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.colors.text,
    marginVertical: 4,
  },
  readingState: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  skipLink: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  skipLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    textDecorationLine: 'underline',
  },
  // Step 3: Test Strips
  stripCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  stripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stripTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  stripSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  scannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.colors.safeSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scannedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.colors.safe,
  },
  stripSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surfaceSubtle,
    padding: 12,
    borderRadius: Theme.radius.md,
  },
  swatchSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  colorSquare: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  swatchResultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
    flexShrink: 1,
  },
  scanStripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanStripBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calibratedTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  calibratedTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.safe,
  },
  // Step 4: Analyzing
  analyzingWrapper: {
    paddingVertical: 20,
  },
  analyzingHeaderBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  analyzingIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Theme.colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: Theme.colors.primaryBorder,
  },
  analyzingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  analyzingSampleSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  overallBarContainer: {
    height: 12,
    backgroundColor: '#E0E3D8',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  overallBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 6,
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
    textAlign: 'right',
    marginBottom: 20,
  },
  checklistCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    gap: 16,
    ...Theme.shadows.card,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ECEEE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: Theme.colors.primary,
  },
  checkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.textMuted,
  },
  checkItemText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  checkItemTextActive: {
    color: Theme.colors.text,
    fontWeight: '700',
  },
});
