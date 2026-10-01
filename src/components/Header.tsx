import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../i18n';

export default function Header() {
  const { language, setLanguage, role, setRole, t } = useApp();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <>
      <View style={styles.container}>
        {/* App Title & Logo */}
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="eco" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>FeedScan</Text>
            <View style={styles.offlineChip}>
              <View style={styles.offlineDot} />
              <Text style={styles.offlineText}>{t('offlineChip')}</Text>
            </View>
          </View>
        </View>

        {/* Right side controls: Role switch & Language picker */}
        <View style={styles.controlsRow}>
          {/* Quick Role Switcher Pill */}
          <TouchableOpacity
            style={[
              styles.rolePill,
              {
                backgroundColor:
                  role === 'officer' ? Theme.colors.accentLight : Theme.colors.surfaceSubtle,
                borderColor:
                  role === 'officer' ? Theme.colors.accentBorder : Theme.colors.border,
              },
            ]}
            onPress={() => setRole(role === 'farmer' ? 'officer' : 'farmer')}
            activeOpacity={0.7}>
            <MaterialIcons
              name={role === 'officer' ? 'admin-panel-settings' : 'agriculture'}
              size={16}
              color={role === 'officer' ? Theme.colors.accentDark : Theme.colors.primaryDark}
            />
            <Text
              style={[
                styles.roleText,
                {
                  color:
                    role === 'officer' ? Theme.colors.accentDark : Theme.colors.primaryDark,
                },
              ]}>
              {role === 'officer' ? 'Officer' : 'Farmer'}
            </Text>
          </TouchableOpacity>

          {/* Language Selector Button */}
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => setLangModalVisible(true)}
            activeOpacity={0.7}>
            <MaterialIcons name="translate" size={17} color={Theme.colors.primaryDark} />
            <Text style={styles.langText}>{currentLangObj.nativeLabel}</Text>
            <MaterialIcons name="arrow-drop-down" size={18} color={Theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <MaterialIcons name="close" size={22} color={Theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {LANGUAGES.map((langItem) => {
              const isSelected = langItem.code === language;
              return (
                <TouchableOpacity
                  key={langItem.code}
                  style={[
                    styles.langOptionItem,
                    isSelected && styles.langOptionSelected,
                  ]}
                  onPress={() => {
                    setLanguage(langItem.code);
                    setLangModalVisible(false);
                  }}>
                  <View>
                    <Text
                      style={[
                        styles.langNativeText,
                        isSelected && styles.langSelectedText,
                      ]}>
                      {langItem.nativeLabel}
                    </Text>
                    <Text style={styles.langLabelText}>{langItem.label}</Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color={Theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.soft,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.3,
  },
  offlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  offlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00897B',
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00695C',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Theme.colors.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.primaryBorder,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.radius.xl,
    padding: 22,
    width: '100%',
    maxWidth: 360,
    ...Theme.shadows.glow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  langOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Theme.radius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langOptionSelected: {
    backgroundColor: Theme.colors.primarySurface,
    borderColor: Theme.colors.primaryBorder,
  },
  langNativeText: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  langSelectedText: {
    color: Theme.colors.primaryDark,
  },
  langLabelText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
});
