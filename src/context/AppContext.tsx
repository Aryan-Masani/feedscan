import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LanguageCode, TranslationKey, t as translateFn } from '../i18n';
import {
  SampleType,
  TestResultData,
  SiloItem,
  SCRIPTED_RESULTS,
  PAST_TESTS_HISTORY,
  INITIAL_SILOS,
} from '../data/demo';
import * as Haptics from 'expo-haptics';

export type UserRole = 'farmer' | 'officer';

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  selectedSampleType: SampleType;
  setSelectedSampleType: (type: SampleType) => void;
  currentResult: TestResultData;
  setCurrentResult: (result: TestResultData) => void;
  history: TestResultData[];
  addTestResult: (result: TestResultData) => void;
  silos: SiloItem[];
  addSilo: (name: string, type: string, capacityTonnes: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  micListening: boolean;
  startListening: (onComplete?: () => void) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (val: boolean) => void;
  textSize: 'normal' | 'large';
  setTextSize: (val: 'normal' | 'large') => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [role, setRoleState] = useState<UserRole>('farmer');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [selectedSampleType, setSelectedSampleType] = useState<SampleType>('compound');
  const [currentResult, setCurrentResult] = useState<TestResultData>(SCRIPTED_RESULTS.compound);
  const [history, setHistory] = useState<TestResultData[]>(PAST_TESTS_HISTORY);
  const [silos, setSilos] = useState<SiloItem[]>(INITIAL_SILOS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [micListening, setMicListening] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  const setLanguage = (lang: LanguageCode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setLanguageState(lang);
  };

  const setRole = (newRole: UserRole) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setRoleState(newRole);
  };

  const showToast = (msg: string) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const startListening = (onComplete?: () => void) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    setMicListening(true);
    setTimeout(() => {
      setMicListening(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  const addTestResult = (result: TestResultData) => {
    setHistory((prev) => [result, ...prev]);
    setCurrentResult(result);
  };

  const addSilo = (name: string, type: string, capacityTonnes: number) => {
    const newSilo: SiloItem = {
      id: `silo-${Date.now()}`,
      name: name || 'New Silo Pit',
      type: type || 'Trench Bunker Silo',
      capacityTonnes: capacityTonnes || 50,
      daysPacked: 1,
      fermentationStage: 'Phase 1: Initial Aerobic Respiration',
      ph: 5.8,
      moisture: 69.5,
      temperature: 32.0,
      gasPpm: 8,
      riskStatus: 'SAFE',
      riskScore: 90,
      history7Days: [
        { day: 'Day 1', ph: 5.8, temp: 32.0 },
      ],
    };
    setSilos((prev) => [newSilo, ...prev]);
    showToast(`Added ${newSilo.name}`);
  };

  const t = (key: TranslationKey) => translateFn(key, language);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        selectedSampleType,
        setSelectedSampleType,
        currentResult,
        setCurrentResult,
        history,
        addTestResult,
        silos,
        addSilo,
        toastMessage,
        showToast,
        micListening,
        startListening,
        voiceEnabled,
        setVoiceEnabled,
        textSize,
        setTextSize,
        t,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppContextProvider');
  }
  return context;
}
