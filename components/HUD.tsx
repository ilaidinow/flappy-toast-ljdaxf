
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface HUDProps {
  score: number;
  highScore?: number | null;
}

export default function HUD({ score, highScore }: HUDProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.score}>Score: {score}</Text>
        {typeof highScore === 'number' && (
          <Text style={styles.highScore}>Best: {highScore}</Text>
        )}
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
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 8,
    zIndex: 10,
  },
  left: {
    flexDirection: 'column',
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
