import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import * as Haptics from 'expo-haptics';

export default function RationPlannerScreen() {
  const { t } = useApp();

  // State
  const [animal, setAnimal] = useState<'cow' | 'buffalo'>('cow');
  const [bodyWeight, setBodyWeight] = useState<number>(450); // kg
  const [milkYield, setMilkYield] = useState<number>(14); // Liters
  const [lactationStage, setLactationStage] = useState<'early' | 'mid' | 'late'>('mid');
  const [isFeedRejected, setIsFeedRejected] = useState<boolean>(false);

  // Compute daily ration
  const isCow = animal === 'cow';
  const stageMultiplier = lactationStage === 'early' ? 1.15 : lactationStage === 'mid' ? 1.0 : 0.85;

  // Normal calculations
  let greenFodderKg = Math.round((bodyWeight * 0.045 + milkYield * 0.35) * stageMultiplier);
  let dryFodderKg = Math.round(bodyWeight * 0.012 + 1.2);
  let concentrateKg = +(((milkYield / (isCow ? 2.5 : 2.0)) + (isCow ? 1.2 : 1.8)) * stageMultiplier).toFixed(1);
  let mineralMixGrams = Math.round(50 + milkYield * 2.5);

  // If feed is rejected, swap to safe alternative ration
  if (isFeedRejected) {
    greenFodderKg += 4;
    dryFodderKg += 1;
    concentrateKg = +(concentrateKg + 0.8).toFixed(1); // safe blended cake
    mineralMixGrams += 25; // buffer compensation
  }

  // Cost estimates in Indian Rupees (₹)
  // Green fodder: ₹2.5/kg, Dry: ₹6.0/kg, Concentrate: ₹28/kg, Mineral: ₹0.12/g
  const greenCost = greenFodderKg * 2.5;
  const dryCost = dryFodderKg * 6.0;
  const concCost = concentrateKg * (isFeedRejected ? 32 : 28);
  const minCost = mineralMixGrams * 0.12;
  const totalCostDay = Math.round(greenCost + dryCost + concCost + minCost);

  const handleWeightChange = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setBodyWeight((prev) => Math.max(300, Math.min(700, prev + delta)));
  };

  const handleYieldChange = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setMilkYield((prev) => Math.max(2, Math.min(40, prev + delta)));
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
        <Text style={styles.headerTitle}>{t('rationPlannerTitle')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Animal Selector */}
        <View style={styles.card}>
          <Text style={styles.inputTitle}>{t('animalType')}</Text>
          <View style={styles.animalRow}>
            <TouchableOpacity
              style={[
                styles.animalBtn,
                animal === 'cow' && styles.animalBtnActive,
              ]}
              onPress={() => setAnimal('cow')}
              activeOpacity={0.85}>
              <MaterialIcons
                name="pets"
                size={22}
                color={animal === 'cow' ? '#FFFFFF' : Theme.colors.primaryDark}
              />
              <Text
                style={[
                  styles.animalBtnText,
                  animal === 'cow' && styles.animalBtnTextActive,
                ]}>
                {t('cowOption')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.animalBtn,
                animal === 'buffalo' && styles.animalBtnActive,
              ]}
              onPress={() => setAnimal('buffalo')}
              activeOpacity={0.85}>
              <MaterialIcons
                name="pets"
                size={22}
                color={animal === 'buffalo' ? '#FFFFFF' : Theme.colors.primaryDark}
              />
              <Text
                style={[
                  styles.animalBtnText,
                  animal === 'buffalo' && styles.animalBtnTextActive,
                ]}>
                {t('buffaloOption')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Body Weight Stepper */}
        <View style={styles.card}>
          <View style={styles.stepperHeader}>
            <Text style={styles.inputTitle}>{t('bodyWeight')}</Text>
            <Text style={styles.stepperValText}>{bodyWeight} kg</Text>
          </View>
          <View style={styles.stepperControlRow}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => handleWeightChange(-25)}>
              <MaterialIcons name="remove" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.stepperDisplay}>
              <Text style={styles.stepperDisplayText}>{bodyWeight} kg</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => handleWeightChange(25)}>
              <MaterialIcons name="add" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Milk Yield Stepper */}
        <View style={styles.card}>
          <View style={styles.stepperHeader}>
            <Text style={styles.inputTitle}>{t('milkYield')}</Text>
            <Text style={styles.stepperValText}>{milkYield} L / day</Text>
          </View>
          <View style={styles.stepperControlRow}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => handleYieldChange(-1)}>
              <MaterialIcons name="remove" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.stepperDisplay}>
              <Text style={styles.stepperDisplayText}>{milkYield} Litres</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => handleYieldChange(1)}>
              <MaterialIcons name="add" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Lactation Phase Chips */}
        <View style={styles.card}>
          <Text style={styles.inputTitle}>{t('lactationStage')}</Text>
          <View style={styles.stageChipsRow}>
            {(['early', 'mid', 'late'] as const).map((stage) => {
              const isActive = lactationStage === stage;
              return (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.stageChip,
                    isActive && styles.stageChipActive,
                  ]}
                  onPress={() => setLactationStage(stage)}
                  activeOpacity={0.85}>
                  <Text
                    style={[
                      styles.stageChipText,
                      isActive && styles.stageChipTextActive,
                    ]}>
                    {stage === 'early'
                      ? 'Early (Peak)'
                      : stage === 'mid'
                      ? 'Mid Stage'
                      : 'Late / Pregnant'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Feed Rejection Toggle */}
        <View style={[styles.card, styles.toggleCard]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={styles.toggleTitleRow}>
              <MaterialIcons
                name="swap-horiz"
                size={20}
                color={isFeedRejected ? Theme.colors.caution : Theme.colors.primary}
              />
              <Text style={styles.toggleTitle}>Alternative Safe Ration</Text>
            </View>
            <Text style={styles.toggleSub}>{t('swapFeedToggle')}</Text>
          </View>
          <Switch
            value={isFeedRejected}
            onValueChange={(val) => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch {}
              setIsFeedRejected(val);
            }}
            trackColor={{ false: '#CFD8DC', true: Theme.colors.cautionBorder }}
            thumbColor={isFeedRejected ? Theme.colors.caution : '#FFFFFF'}
          />
        </View>

        {/* Output Daily Ration */}
        <View style={styles.outputCard}>
          <View style={styles.outputHeader}>
            <MaterialIcons name="restaurant" size={22} color={Theme.colors.primaryDark} />
            <Text style={styles.outputHeaderTitle}>{t('dailyRationOutput')}</Text>
          </View>

          {isFeedRejected && (
            <View style={styles.swappedBanner}>
              <MaterialIcons name="info" size={16} color="#E65100" />
              <Text style={styles.swappedBannerText}>
                Active: Safe emergency ration using cotton cake + green forage buffer
              </Text>
            </View>
          )}

          <View style={styles.rationGrid}>
            <View style={styles.rationItem}>
              <Text style={styles.rationItemLabel}>Green Fodder (Hybrid Napier)</Text>
              <Text style={styles.rationItemValue}>{greenFodderKg} kg</Text>
            </View>
            <View style={styles.rationItem}>
              <Text style={styles.rationItemLabel}>Dry Fodder (Sorghum Kadbi)</Text>
              <Text style={styles.rationItemValue}>{dryFodderKg} kg</Text>
            </View>
            <View style={styles.rationItem}>
              <Text style={styles.rationItemLabel}>
                {isFeedRejected
                  ? 'Safe Balanced Mash (Cottonseed + Chana)'
                  : 'Compound Concentrate Pellets'}
              </Text>
              <Text style={styles.rationItemValue}>{concentrateKg} kg</Text>
            </View>
            <View style={styles.rationItem}>
              <Text style={styles.rationItemLabel}>Chelated Mineral Mixture</Text>
              <Text style={styles.rationItemValue}>{mineralMixGrams} g</Text>
            </View>
          </View>

          {/* Daily Cost Output */}
          <View style={styles.costBox}>
            <View>
              <Text style={styles.costLabel}>{t('dailyCost')}</Text>
              <Text style={styles.costSub}>Per animal / 24 hours</Text>
            </View>
            <Text style={styles.costValue}>₹{totalCostDay}</Text>
          </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 10,
  },
  animalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  animalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
  },
  animalBtnActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primaryDark,
  },
  animalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  animalBtnTextActive: {
    color: '#FFFFFF',
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepperValText: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  stepperControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  stepperDisplay: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  stepperDisplayText: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  stageChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stageChip: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  stageChipActive: {
    backgroundColor: Theme.colors.primarySurface,
    borderColor: Theme.colors.primary,
  },
  stageChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  stageChipTextActive: {
    color: Theme.colors.primaryDark,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9E6',
    borderColor: '#FFE082',
  },
  toggleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E65100',
  },
  toggleSub: {
    fontSize: 12,
    color: '#5D4037',
    lineHeight: 16,
  },
  outputCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Theme.colors.primaryBorder,
    marginBottom: 30,
    ...Theme.shadows.card,
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  outputHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.colors.primaryDark,
  },
  swappedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE0B2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  swappedBannerText: {
    fontSize: 11,
    color: '#BF360C',
    fontWeight: '700',
    flex: 1,
  },
  rationGrid: {
    gap: 10,
    marginBottom: 16,
  },
  rationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  rationItemLabel: {
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  rationItemValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  costBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.primarySurface,
    borderRadius: Theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.colors.primaryBorder,
  },
  costLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  costSub: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 1,
  },
  costValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.primaryDark,
  },
});
