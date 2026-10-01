import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SampleType } from '../data/demo';

interface FeedSampleSvgProps {
  sampleType: SampleType;
  isScanning?: boolean;
}

export default function FeedSampleSvg({
  sampleType,
  isScanning = true,
}: FeedSampleSvgProps) {
  const scanLineY = useSharedValue(20);

  useEffect(() => {
    if (isScanning) {
      scanLineY.value = withRepeat(
        withTiming(260, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [isScanning, scanLineY]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const renderSampleGfx = () => {
    switch (sampleType) {
      case 'compound':
        return (
          <G>
            {/* Background textured tray/paper */}
            <Rect x="0" y="0" width="300" height="300" fill="#F4F1EA" />
            
            {/* Subtle paper shadow */}
            <Rect x="15" y="15" width="270" height="270" rx="16" fill="#EDE8DF" />

            {/* Scattered Pellets */}
            {/* Dark brown cattle pellets */}
            <Rect x="55" y="70" width="38" height="14" rx="7" fill="#5D4037" transform="rotate(25 55 70)" />
            <Rect x="110" y="50" width="42" height="15" rx="7.5" fill="#4E342E" transform="rotate(-15 110 50)" />
            <Rect x="180" y="65" width="36" height="14" rx="7" fill="#6D4C41" transform="rotate(45 180 65)" />
            <Rect x="75" y="130" width="40" height="15" rx="7.5" fill="#4E342E" transform="rotate(-35 75 130)" />
            <Rect x="145" y="115" width="44" height="16" rx="8" fill="#5D4037" transform="rotate(10 145 115)" />
            <Rect x="210" y="135" width="36" height="14" rx="7" fill="#6D4C41" transform="rotate(60 210 135)" />
            <Rect x="60" y="200" width="40" height="15" rx="7.5" fill="#5D4037" transform="rotate(-20 60 200)" />
            <Rect x="135" y="190" width="42" height="15" rx="7.5" fill="#4E342E" transform="rotate(30 135 190)" />
            <Rect x="195" y="215" width="38" height="14" rx="7" fill="#6D4C41" transform="rotate(-10 195 215)" />
            <Rect x="120" y="240" width="36" height="13" rx="6.5" fill="#5D4037" transform="rotate(15 120 240)" />

            {/* Crushed grain / mash specks */}
            <Circle cx="95" cy="95" r="4.5" fill="#D7CCC8" />
            <Circle cx="160" cy="80" r="5" fill="#FFE082" />
            <Circle cx="230" cy="100" r="4" fill="#D7CCC8" />
            <Circle cx="105" cy="165" r="5.5" fill="#FFD54F" />
            <Circle cx="180" cy="160" r="4.5" fill="#FFE082" />
            <Circle cx="90" cy="235" r="4" fill="#D7CCC8" />
            <Circle cx="165" cy="230" r="5" fill="#FFD54F" />
            <Circle cx="235" cy="180" r="4.5" fill="#FFE082" />

            {/* Adulteration: White silica/sand grains (distinguishable specks) */}
            <Circle cx="80" cy="110" r="3" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
            <Circle cx="125" cy="135" r="3.2" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
            <Circle cx="170" cy="140" r="2.8" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
            <Circle cx="150" cy="175" r="3" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
            <Circle cx="115" cy="210" r="3.5" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
            <Circle cx="205" cy="165" r="2.6" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
            <Circle cx="190" cy="95" r="3" fill="#FFFFFF" stroke="#BDBDBD" strokeWidth="0.8" />
          </G>
        );

      case 'dry_fodder':
        return (
          <G>
            <Rect x="0" y="0" width="300" height="300" fill="#F8F4EC" />
            {/* Straw fibres intersecting */}
            <Path d="M40 50 Q120 70 260 60" stroke="#D4A373" strokeWidth="5" strokeLinecap="round" />
            <Path d="M50 120 Q160 110 250 140" stroke="#E9C46A" strokeWidth="6" strokeLinecap="round" />
            <Path d="M70 180 Q150 190 240 170" stroke="#D4A373" strokeWidth="5.5" strokeLinecap="round" />
            <Path d="M60 240 Q170 230 250 250" stroke="#CCD5AE" strokeWidth="5" strokeLinecap="round" />
            
            {/* Cross diagonals */}
            <Path d="M70 60 L230 240" stroke="#E9C46A" strokeWidth="4.5" strokeLinecap="round" />
            <Path d="M240 80 L60 220" stroke="#D4A373" strokeWidth="5" strokeLinecap="round" />
            <Path d="M120 40 L180 260" stroke="#BC6C25" strokeWidth="4" strokeLinecap="round" />
            <Path d="M180 40 L110 260" stroke="#D4A373" strokeWidth="4" strokeLinecap="round" />

            {/* Fodder bits & particles */}
            <Circle cx="130" cy="120" r="4" fill="#CCD5AE" />
            <Circle cx="160" cy="170" r="5" fill="#E9C46A" />
            <Circle cx="100" cy="200" r="3.5" fill="#D4A373" />
            <Circle cx="210" cy="110" r="4.5" fill="#E9C46A" />
          </G>
        );

      case 'green_fodder':
        return (
          <G>
            <Rect x="0" y="0" width="300" height="300" fill="#F1F8E9" />
            {/* Fresh cut hybrid Napier / maize green leaves */}
            <Path d="M30 60 Q140 100 270 50" stroke="#388E3C" strokeWidth="8" strokeLinecap="round" />
            <Path d="M40 120 Q150 70 260 130" stroke="#4CAF50" strokeWidth="9" strokeLinecap="round" />
            <Path d="M50 180 Q130 220 250 170" stroke="#2E7D32" strokeWidth="10" strokeLinecap="round" />
            <Path d="M60 240 Q160 210 260 250" stroke="#4CAF50" strokeWidth="8.5" strokeLinecap="round" />
            
            <Path d="M80 40 L220 260" stroke="#81C784" strokeWidth="7" strokeLinecap="round" />
            <Path d="M220 40 L80 260" stroke="#43A047" strokeWidth="8" strokeLinecap="round" />
            
            {/* Succulent stems */}
            <Circle cx="110" cy="140" r="6" fill="#C8E6C9" />
            <Circle cx="190" cy="120" r="7" fill="#A5D6A7" />
            <Circle cx="150" cy="200" r="6.5" fill="#81C784" />
          </G>
        );

      case 'mineral_mix':
        return (
          <G>
            <Rect x="0" y="0" width="300" height="300" fill="#ECEFF1" />
            {/* Fine mineral powder with micronutrient flecks */}
            <Circle cx="150" cy="150" r="100" fill="#CFD8DC" />
            <Circle cx="140" cy="140" r="70" fill="#B0BEC5" opacity={0.6} />

            {/* Granules */}
            <Circle cx="110" cy="120" r="4" fill="#78909C" />
            <Circle cx="180" cy="130" r="3.5" fill="#607D8B" />
            <Circle cx="130" cy="170" r="4.5" fill="#90A4AE" />
            <Circle cx="170" cy="180" r="3" fill="#546E7A" />
            <Circle cx="145" cy="110" r="3" fill="#78909C" />
            <Circle cx="155" cy="195" r="4" fill="#607D8B" />

            {/* Silica sand contamination grains in mineral mix */}
            <Circle cx="125" cy="145" r="3.5" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1" />
            <Circle cx="165" cy="155" r="3.5" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1" />
            <Circle cx="140" cy="130" r="3" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="1" />
          </G>
        );

      case 'silage':
      default:
        return (
          <G>
            <Rect x="0" y="0" width="300" height="300" fill="#F9FBE7" />
            {/* Fermented corn silage, golden yellow corn bits, chopped stems */}
            <Path d="M40 70 Q130 90 260 60" stroke="#827717" strokeWidth="7" strokeLinecap="round" />
            <Path d="M50 140 Q160 120 250 150" stroke="#9E9D24" strokeWidth="8" strokeLinecap="round" />
            <Path d="M60 210 Q140 230 240 190" stroke="#795548" strokeWidth="7" strokeLinecap="round" />
            
            {/* Golden corn kernels */}
            <Circle cx="90" cy="100" r="7" fill="#FBC02D" />
            <Circle cx="150" cy="85" r="8" fill="#FDD835" />
            <Circle cx="210" cy="115" r="7.5" fill="#FBC02D" />
            <Circle cx="115" cy="165" r="8" fill="#FDD835" />
            <Circle cx="175" cy="160" r="7" fill="#FBC02D" />
            <Circle cx="130" cy="225" r="7.5" fill="#FDD835" />
            <Circle cx="195" cy="220" r="8" fill="#FBC02D" />

            {/* Trace aerobic mould spots (white-grey fuzzy edge) */}
            <Circle cx="70" cy="180" r="6" fill="#CFD8DC" opacity={0.8} />
            <Circle cx="230" cy="80" r="5" fill="#CFD8DC" opacity={0.7} />
          </G>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 300 300">
        <Defs>
          <LinearGradient id="laserGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#4CAF50" stopOpacity="0" />
            <Stop offset="25%" stopColor="#4CAF50" stopOpacity="0.8" />
            <Stop offset="50%" stopColor="#00E676" stopOpacity="1" />
            <Stop offset="75%" stopColor="#4CAF50" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {renderSampleGfx()}
      </Svg>

      {/* Laser Scanning Line */}
      {isScanning && (
        <Animated.View style={[styles.laserContainer, scanLineStyle]}>
          <View style={styles.laserGlow} />
          <View style={styles.laserBeam} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    position: 'relative',
    backgroundColor: '#EAECE4',
  },
  laserContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laserGlow: {
    position: 'absolute',
    height: 16,
    width: '100%',
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
  },
  laserBeam: {
    height: 3,
    width: '100%',
    backgroundColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
});
