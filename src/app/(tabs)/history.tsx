import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { TestResultData, VerdictType } from '../../data/demo';
import VerdictBadge from '../../components/VerdictBadge';
import Header from '../../components/Header';
import * as Haptics from 'expo-haptics';

export default function HistoryScreen() {
  const { history, setCurrentResult, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState<'ALL' | VerdictType>('ALL');

  const filteredTests = history.filter((test) => {
    const matchesFilter =
      selectedVerdictFilter === 'ALL' || test.verdict === selectedVerdictFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      test.sampleName.toLowerCase().includes(q) ||
      test.brandName.toLowerCase().includes(q) ||
      test.batchNumber.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const handleSelectTest = (test: TestResultData) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCurrentResult(test);
    router.push('/result');
  };

  const filterChips: { id: 'ALL' | VerdictType; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Tests', count: history.length },
    {
      id: 'SAFE',
      label: 'Safe',
      count: history.filter((h) => h.verdict === 'SAFE').length,
    },
    {
      id: 'CAUTION',
      label: 'Caution',
      count: history.filter((h) => h.verdict === 'CAUTION').length,
    },
    {
      id: 'REJECT',
      label: 'Reject',
      count: history.filter((h) => h.verdict === 'REJECT').length,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.headerTitleBox}>
          <Text style={styles.screenTitle}>{t('tabsHistory')}</Text>
          <Text style={styles.screenSub}>
            Complete offline ledger of all tested cattle feed & silage lots
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={22} color={Theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by feed brand, sample, or batch #..."
            placeholderTextColor={Theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={18} color={Theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Verdict Filter Chips */}
        <View style={styles.filterRow}>
          {filterChips.map((chip) => {
            const isSelected = selectedVerdictFilter === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.chipBtn,
                  isSelected && styles.chipBtnActive,
                ]}
                onPress={() => setSelectedVerdictFilter(chip.id)}
                activeOpacity={0.85}>
                <Text
                  style={[
                    styles.chipBtnText,
                    isSelected && styles.chipBtnTextActive,
                  ]}>
                  {chip.label} ({chip.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Test Result Cards List */}
        <View style={styles.testsList}>
          {filteredTests.filter(Boolean).map((test, idx) => (
            <TouchableOpacity
              key={test.id ?? `hist-${idx}`}
              style={styles.testCard}
              onPress={() => handleSelectTest(test)}
              activeOpacity={0.85}>
              <View style={styles.testCardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sampleNameText}>{test.sampleName}</Text>
                  <Text style={styles.batchSubText}>
                    {test.brandName} • #{test.batchNumber}
                  </Text>
                  <Text style={styles.dateText}>{test.testDate}</Text>
                </View>

                <VerdictBadge verdict={test.verdict} size="sm" />
              </View>

              {/* Metrics Pill Row */}
              <View style={styles.metricsRow}>
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

                <View style={styles.metricPill}>
                  <Text style={styles.metricPillText}>
                    Protein {test.metrics.protein.value}%
                  </Text>
                </View>

                <View style={styles.metricPill}>
                  <Text style={styles.metricPillText}>
                    H2O {test.metrics.moisture.value}%
                  </Text>
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={Theme.colors.textMuted}
                  style={{ marginLeft: 'auto' }}
                />
              </View>
            </TouchableOpacity>
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
    marginBottom: 14,
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 12,
    gap: 8,
    ...Theme.shadows.soft,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.text,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chipBtn: {
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  chipBtnActive: {
    backgroundColor: Theme.colors.primarySurface,
    borderColor: Theme.colors.primary,
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  chipBtnTextActive: {
    color: Theme.colors.primaryDark,
  },
  testsList: {
    gap: 10,
    marginBottom: 30,
  },
  testCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  testCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sampleNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  batchSubText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
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
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  scorePillVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  metricPill: {
    backgroundColor: Theme.colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metricPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
});
