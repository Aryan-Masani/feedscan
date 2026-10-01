import React, { useEffect } from 'react';
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
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n';
import * as Haptics from 'expo-haptics';

export default function OnboardingScreen() {
  const {
    language,
    setLanguage,
    role,
    setRole,
    setHasCompletedOnboarding,
    t,
  } = useApp();

  const logoScale = useSharedValue(0.8);
  const logoRotate = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });

    logoRotate.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [logoRotate, logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));

  const handleEnterApp = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Splash Brand Hero */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logoOuterRing}>
              <View style={styles.logoInnerCircle}>
                <MaterialIcons name="eco" size={44} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>

          <Text style={styles.appTitle}>FeedScan</Text>
          <View style={styles.offlineChip}>
            <MaterialIcons name="offline-pin" size={14} color="#00695C" />
            <Text style={styles.offlineText}>{t('offlineChip')}</Text>
          </View>
          <Text style={styles.tagline}>{t('tagline')}</Text>
          <Text style={styles.welcomeSub}>{t('welcomeSub')}</Text>
        </View>

        {/* Step 1: Language Selection in Native Script */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="translate" size={20} color={Theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t('selectLanguage')}</Text>
          </View>

          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected,
                  ]}
                  onPress={() => setLanguage(lang.code)}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.langNative,
                      isSelected && styles.langNativeSelected,
                    ]}>
                    {lang.nativeLabel}
                  </Text>
                  <Text
                    style={[
                      styles.langSub,
                      isSelected && styles.langSubSelected,
                    ]}>
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.langCheck}>
                      <MaterialIcons name="check" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Role Selection (Farmer vs Cooperative Officer) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="badge" size={20} color={Theme.colors.primary} />
            <Text style={styles.sectionTitle}>{t('selectRole')}</Text>
          </View>

          {/* Farmer Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              role === 'farmer' && styles.roleCardSelected,
            ]}
            onPress={() => setRole('farmer')}
            activeOpacity={0.8}>
            <View
              style={[
                styles.roleIconCircle,
                role === 'farmer' && { backgroundColor: Theme.colors.primary },
              ]}>
              <MaterialIcons
                name="agriculture"
                size={26}
                color={role === 'farmer' ? '#FFFFFF' : Theme.colors.primary}
              />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>{t('farmerRoleTitle')}</Text>
              <Text style={styles.roleDesc}>{t('farmerRoleDesc')}</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                role === 'farmer' && styles.radioOuterSelected,
              ]}>
              {role === 'farmer' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* Officer Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              role === 'officer' && styles.roleCardSelected,
            ]}
            onPress={() => setRole('officer')}
            activeOpacity={0.8}>
            <View
              style={[
                styles.roleIconCircle,
                role === 'officer' && { backgroundColor: Theme.colors.accentDark },
              ]}>
              <MaterialIcons
                name="admin-panel-settings"
                size={26}
                color={role === 'officer' ? '#FFFFFF' : Theme.colors.accentDark}
              />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>{t('officerRoleTitle')}</Text>
              <Text style={styles.roleDesc}>{t('officerRoleDesc')}</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                role === 'officer' && styles.radioOuterSelected,
              ]}>
              {role === 'officer' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Big Action Button */}
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleEnterApp}
          activeOpacity={0.85}>
          <Text style={styles.enterButtonText}>{t('getStarted')}</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoOuterRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Theme.colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primaryBorder,
  },
  logoInnerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.glow,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Theme.colors.primaryDark,
    letterSpacing: -0.5,
  },
  offlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00695C',
  },
  tagline: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    position: 'relative',
  },
  langCardSelected: {
    backgroundColor: Theme.colors.primarySurface,
    borderColor: Theme.colors.primary,
  },
  langNative: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  langNativeSelected: {
    color: Theme.colors.primaryDark,
  },
  langSub: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  langSubSelected: {
    color: Theme.colors.primary,
  },
  langCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceSubtle,
    borderRadius: Theme.radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    gap: 12,
  },
  roleCardSelected: {
    backgroundColor: Theme.colors.primarySurface,
    borderColor: Theme.colors.primary,
  },
  roleIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8EFE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  roleDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    paddingVertical: 16,
    borderRadius: Theme.radius.full,
    gap: 10,
    marginTop: 10,
    minHeight: 56,
    ...Theme.shadows.glow,
  },
  enterButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
