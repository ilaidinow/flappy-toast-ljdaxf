
import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/commonStyles';

interface ToastSpriteProps {
  x: number;
  y: number;
  width: number;
  height: number;
  blinking?: boolean;
}

function ToastSpriteComponent({ x, y, width, height, blinking }: ToastSpriteProps) {
  const faceSize = Math.min(width, height);
  const eyeSize = Math.max(2, Math.floor(faceSize * 0.12));
  const eyeYOffset = Math.floor(faceSize * 0.18);
  const eyeXOffset = Math.floor(faceSize * 0.2);
  const mouthWidth = Math.floor(faceSize * 0.4);
  const mouthHeight = Math.max(2, Math.floor(faceSize * 0.08));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: x,
          top: y,
          width,
          height,
          opacity: blinking ? 0.6 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={['#FFE0A3', '#FFD18A']}
        start={[0.1, 0.1]}
        end={[0.9, 0.9]}
        style={styles.toast}
      >
        <View style={styles.crustTop} />
        <View style={styles.crustSide} />
        {/* Eyes */}
        <View
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              left: width / 2 - eyeXOffset - eyeSize / 2,
              top: height / 2 - eyeYOffset,
            },
          ]}
        />
        <View
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              left: width / 2 + eyeXOffset - eyeSize / 2,
              top: height / 2 - eyeYOffset,
            },
          ]}
        />
        {/* Smile */}
        <View
          style={[
            styles.mouth,
            {
              width: mouthWidth,
              height: mouthHeight,
              left: width / 2 - mouthWidth / 2,
              top: height / 2 + eyeYOffset / 2,
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  toast: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C07A35',
    overflow: 'hidden',
  },
  crustTop: {
    position: 'absolute',
    top: 0,
    height: 10,
    width: '100%',
    backgroundColor: '#E3A254',
    opacity: 0.7,
  },
  crustSide: {
    position: 'absolute',
    right: 0,
    width: 8,
    height: '100%',
    backgroundColor: '#E3A254',
    opacity: 0.7,
  },
  eye: {
    position: 'absolute',
    backgroundColor: '#3B250F',
    borderRadius: 999,
  },
  mouth: {
    position: 'absolute',
    backgroundColor: '#3B250F',
    borderRadius: 999,
  },
});

const ToastSprite = memo(ToastSpriteComponent);
export default ToastSprite;
