import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function MicOverlay() {
  const { micListening, t } = useApp();

  const pulseScale = useSharedValue(1);
  const bar1 = useSharedValue(16);
  const bar2 = useSharedValue(32);
  const bar3 = useSharedValue(24);
  const bar4 = useSharedValue(40);
  const bar5 = useSharedValue(20);

  useEffect(() => {
    if (micListening) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 500, easing: Easing.out(Easing.ease) }),
          withTiming(1.0, { duration: 500, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );

      bar1.value = withRepeat(
        withSequence(withTiming(42, { duration: 300 }), withTiming(14, { duration: 300 })),
        -1,
        true
      );
      bar2.value = withRepeat(
        withSequence(withTiming(18, { duration: 250 }), withTiming(48, { duration: 250 })),
        -1,
        true
      );
      bar3.value = withRepeat(
        withSequence(withTiming(52, { duration: 350 }), withTiming(20, { duration: 350 })),
        -1,
        true
      );
      bar4.value = withRepeat(
        withSequence(withTiming(22, { duration: 280 }), withTiming(46, { duration: 280 })),
        -1,
        true
      );
      bar5.value = withRepeat(
        withSequence(withTiming(38, { duration: 320 }), withTiming(16, { duration: 320 })),
        -1,
        true
      );
    }
  }, [micListening, pulseScale, bar1, bar2, bar3, bar4, bar5]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 0.35,
  }));

  const barStyle1 = useAnimatedStyle(() => ({ height: bar1.value }));
  const barStyle2 = useAnimatedStyle(() => ({ height: bar2.value }));
  const barStyle3 = useAnimatedStyle(() => ({ height: bar3.value }));
  const barStyle4 = useAnimatedStyle(() => ({ height: bar4.value }));
  const barStyle5 = useAnimatedStyle(() => ({ height: bar5.value }));

  if (!micListening) return null;

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.micCircleWrapper}>
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
          <View style={styles.micCircle}>
            <MaterialIcons name="mic" size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>{t('voiceListening')}</Text>
        <Text style={styles.subtitle}>{t('voiceHelpText')}</Text>

        {/* Animated Waveform Bars */}
        <View style={styles.waveformContainer}>
          <Animated.View style={[styles.waveBar, barStyle1]} />
          <Animated.View style={[styles.waveBar, barStyle2]} />
          <Animated.View style={[styles.waveBar, barStyle3]} />
          <Animated.View style={[styles.waveBar, barStyle4]} />
          <Animated.View style={[styles.waveBar, barStyle5]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(15, 26, 14, 0.75)',
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.radius.xl,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...Theme.shadows.glow,
  },
  micCircleWrapper: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.primaryLight,
  },
  micCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.card,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
  },
  waveBar: {
    width: 6,
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
});
