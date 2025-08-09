
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface HUDProps {
  score: number;
  lives: number;
  highScore?: number | null;
}

export default function HUD({ score, lives, highScore }: HUDProps) {
  const hearts = Array.from({ length: lives });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.score}>Score: {score}</Text>
        {typeof highScore === 'number' && (
          <Text style={styles.highScore}>Best: {highScore}</Text>
        )}
      </View>
      <View style={styles.right}>
        {hearts.map((_, idx) => (
          <Ionicons key={idx} name="heart" size={24} color={colors.heart} style={{ marginLeft: 6 }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 8,
    zIndex: 10,
  },
  left: {
    flexDirection: 'column',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 22,
    color: colors.text,
  },
  highScore: {
    fontFamily: 'Baloo2_400Regular',
    fontSize: 16,
    color: '#6D4C2C',
  },
});
