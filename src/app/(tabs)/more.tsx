import React from 'react';
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
import { Theme } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n';
import Header from '../../components/Header';
import * as Haptics from 'expo-haptics';

export default function MoreAndSettingsScreen() {
  const {
    language,
    setLanguage,
    voiceEnabled,
    setVoiceEnabled,
    textSize,
    setTextSize,
    role,
    setRole,
    showToast,
    t,
  } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.headerTitleBox}>
          <Text style={styles.screenTitle}>{t('settingsTitle')}</Text>
          <Text style={styles.screenSub}>
            Farm utilities, ration planning, and device preferences
          </Text>
        </View>

        {/* Quick Tools Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Farm Utilities & Tools</Text>

          {/* Tool 1: Ration Planner */}
          <TouchableOpacity
            style={styles.toolItemRow}
            onPress={() => router.push('/ration-planner')}
            activeOpacity={0.8}>
            <View style={[styles.toolIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <MaterialIcons name="calculate" size={24} color={Theme.colors.primaryDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>{t('rationPlannerTitle')}</Text>
              <Text style={styles.toolSub}>Calculate daily green, dry, and concentrate ration</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          {/* Tool 2: Batch Traceability */}
          <TouchableOpacity
            style={styles.toolItemRow}
            onPress={() => router.push('/traceability')}
            activeOpacity={0.8}>
            <View style={[styles.toolIconCircle, { backgroundColor: '#EDE7F6' }]}>
              <MaterialIcons name="qr-code-2" size={24} color="#5E35B1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>{t('traceabilityTitle')}</Text>
              <Text style={styles.toolSub}>Audit certificates and supply chain history</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Theme.colors.textMuted} />
          </TouchableOpacity>

          {/* Tool 3: QR Scanner */}
          <TouchableOpacity
            style={[styles.toolItemRow, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/scan-qr')}
            activeOpacity={0.8}>
            <View style={[styles.toolIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <MaterialIcons name="qr-code-scanner" size={24} color={Theme.colors.accentDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toolTitle}>Authenticate Feed Sack</Text>
              <Text style={styles.toolSub}>Offline camera verification against cooperative registry</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color={Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Language Selection Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{t('appLanguage')}</Text>
          <View style={styles.languagesGrid}>
            {LANGUAGES.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <TouchableOpacity
                  key={langItem.code}
                  style={[
                    styles.langChip,
                    isSelected && styles.langChipSelected,
                  ]}
                  onPress={() => {
                    setLanguage(langItem.code);
                    showToast(`Language switched to ${langItem.nativeLabel}`);
                  }}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.langChipNative,
                      isSelected && styles.langChipNativeSelected,
                    ]}>
                    {langItem.nativeLabel}
                  </Text>
                  <Text
                    style={[
                      styles.langChipEnglish,
                      isSelected && styles.langChipEnglishSelected,
                    ]}>
                    {langItem.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferences / Toggles */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Device & Field Preferences</Text>

          {/* Voice Guidance Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>{t('voiceGuidance')}</Text>
              <Text style={styles.toggleSub}>
                Spoken audio advisories in selected native language
              </Text>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={(val) => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch {}
                setVoiceEnabled(val);
                showToast(val ? 'Voice guidance enabled' : 'Voice guidance muted');
              }}
              trackColor={{ false: '#CFD8DC', true: Theme.colors.primaryBorder }}
              thumbColor={voiceEnabled ? Theme.colors.primary : '#FFFFFF'}
            />
          </View>

          {/* Large Text Size for Sunny Fields Toggle */}
          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>{t('textSize')}</Text>
              <Text style={styles.toggleSub}>
                High-contrast bold font styling for bright sunlight outdoor use
              </Text>
            </View>
            <Switch
              value={textSize === 'large'}
              onValueChange={(val) => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch {}
                setTextSize(val ? 'large' : 'normal');
                showToast(val ? 'High-contrast large text enabled' : 'Standard text size set');
              }}
              trackColor={{ false: '#CFD8DC', true: Theme.colors.primaryBorder }}
              thumbColor={textSize === 'large' ? Theme.colors.primary : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Role Switching */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{t('activeRole')}</Text>
          <View style={styles.roleSwitchRow}>
            <TouchableOpacity
              style={[
                styles.roleSwitchBtn,
                role === 'farmer' && styles.roleSwitchBtnActive,
              ]}
              onPress={() => {
                setRole('farmer');
                showToast('Switched to Farmer Profile');
              }}
              activeOpacity={0.85}>
              <MaterialIcons
                name="agriculture"
                size={20}
                color={role === 'farmer' ? '#FFFFFF' : Theme.colors.primaryDark}
              />
              <Text
                style={[
                  styles.roleSwitchText,
                  role === 'farmer' && styles.roleSwitchTextActive,
                ]}>
                Dairy Farmer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleSwitchBtn,
                role === 'officer' && [styles.roleSwitchBtnActive, { backgroundColor: Theme.colors.accentDark, borderColor: Theme.colors.accentDark }],
              ]}
              onPress={() => {
                setRole('officer');
                showToast('Switched to Cooperative Officer Profile');
              }}
              activeOpacity={0.85}>
              <MaterialIcons
                name="admin-panel-settings"
                size={20}
                color={role === 'officer' ? '#FFFFFF' : Theme.colors.accentDark}
              />
              <Text
                style={[
                  styles.roleSwitchText,
                  role === 'officer' && styles.roleSwitchTextActive,
                ]}>
                Co-op Officer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Intro Replay Button */}
        <TouchableOpacity
          style={styles.replayIntroBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.85}>
          <MaterialIcons name="replay" size={20} color={Theme.colors.primaryDark} />
          <Text style={styles.replayIntroText}>Replay Intro & Splash Screen</Text>
        </TouchableOpacity>

        {/* About FeedScan Prototype */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <MaterialIcons name="eco" size={22} color={Theme.colors.primary} />
            <Text style={styles.aboutTitle}>{t('aboutPrototype')}</Text>
          </View>
          <Text style={styles.aboutDesc}>{t('aboutDesc')}</Text>
          <Text style={styles.buildInfoText}>
            Build 2026.10 • Tested for Anand & Banaskantha Milk Unions
          </Text>
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
  sectionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.soft,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  toolItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 12,
  },
  toolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  toolSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
  },
  langChipSelected: {
    backgroundColor: Theme.colors.primarySurface,
    borderColor: Theme.colors.primary,
  },
  langChipNative: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  langChipNativeSelected: {
    color: Theme.colors.primaryDark,
  },
  langChipEnglish: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  langChipEnglishSelected: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  toggleSub: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
    paddingRight: 10,
  },
  roleSwitchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
  },
  roleSwitchBtnActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primaryDark,
  },
  roleSwitchText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  roleSwitchTextActive: {
    color: '#FFFFFF',
  },
  replayIntroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primarySurface,
    borderRadius: Theme.radius.full,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.primaryBorder,
  },
  replayIntroText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  aboutCard: {
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 30,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  aboutDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  buildInfoText: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    marginTop: 8,
    fontWeight: '600',
  },
});
