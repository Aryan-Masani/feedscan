import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Theme } from '../constants/theme';
import { VerdictType } from '../data/demo';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  verdict: VerdictType;
  showSubtext?: boolean;
}

export default function ScoreRing({
  score,
  size = 140,
  strokeWidth = 12,
  verdict,
  showSubtext = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [score, progress]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const getVerdictColor = () => {
    switch (verdict) {
      case 'SAFE':
        return Theme.colors.safe;
      case 'CAUTION':
        return Theme.colors.caution;
      case 'REJECT':
        return Theme.colors.reject;
      default:
        return Theme.colors.primary;
    }
  };

  const ringColor = getVerdictColor();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background track circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EAECE4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress active circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
          fill="none"
          origin={`${size / 2}, ${size / 2}`}
          rotation="-90"
        />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.scoreText, { color: ringColor }]}>{score}</Text>
        <Text style={styles.totalText}>/ 100</Text>
        {showSubtext && <Text style={styles.labelText}>Quality Index</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
    marginTop: -2,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: Theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
