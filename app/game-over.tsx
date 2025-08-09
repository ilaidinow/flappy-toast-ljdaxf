
import { View, Text, Image } from 'react-native';
import Button from '../components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import { useEffect, useState } from 'react';
import { getHighScore } from '../utils/storage';

export default function GameOver() {
  const { score } = useLocalSearchParams<{ score?: string }>();
  const finalScore = Number(score ?? '0');
  const [highScore, setHighScoreState] = useState(0);

  useEffect(() => {
    (async () => {
      const hs = await getHighScore();
      setHighScoreState(hs);
    })();
  }, []);

  const isNewRecord = finalScore >= highScore && finalScore > 0;

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.content, { paddingVertical: 24 }]}>
        <Image
          source={require('../assets/images/final_quest_240x240.png')}
          style={{ width: 160, height: 160, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text style={commonStyles.title}>Game Over</Text>
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
          <Text style={commonStyles.text}>Score: {finalScore}</Text>
          <Text style={commonStyles.text}>High Score: {highScore}</Text>
          {isNewRecord && <Text style={[commonStyles.text, { color: '#2A7A2A', fontWeight: '700' }]}>New Record!</Text>}
        </View>
        <View style={{ width: '100%', marginTop: 8 }}>
          <Button text="Play Again" onPress={() => router.replace('/game')} style={buttonStyles.primary} />
          <Button text="Back to Home" onPress={() => router.replace('/')} style={[buttonStyles.backButton, { marginTop: 10 }]} textStyle={{ color: '#F8EFD1' }} />
        </View>
      </View>
    </View>
  );
}
