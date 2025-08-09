
import { Text, View, Image, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import { getHighScore } from '../utils/storage';

export default function MainScreen() {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const hs = await getHighScore();
      setHighScore(hs);
    })();
  }, []);

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={[commonStyles.content, { paddingVertical: 32 }]} bounces={false}>
        <Image
          source={require('../assets/images/natively-dark.png')}
          style={{ width: 140, height: 140, marginBottom: 12, tintColor: undefined }}
          resizeMode="contain"
        />
        <Text style={commonStyles.title}>Flappy Toast</Text>
        <View style={commonStyles.card}>
          <Text style={commonStyles.text}>A cute, toasty arcade adventure. Tap to hop your toast and dodge incoming toasters!</Text>
        </View>

        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
          <Text style={[commonStyles.text, { fontSize: 16 }]}>
            Controls:
          </Text>
          <Text style={commonStyles.text}>- Tap anywhere to jump</Text>
          <Text style={commonStyles.text}>- {Platform.OS === 'web' ? 'Press Space or Arrow Up to jump (web)' : 'Supports haptics on mobile'}</Text>
        </View>

        <View style={{ width: '100%', marginTop: 8 }}>
          <Button
            text="Play"
            onPress={() => router.push('/game')}
            style={buttonStyles.primary}
          />
          <Button
            text={`High Score: ${highScore}`}
            onPress={() => {}}
            style={[buttonStyles.secondary, { marginTop: 10 }]}
            textStyle={{ color: '#4A350D' }}
          />
        </View>

        <View style={[commonStyles.card, { marginTop: 16 }]}>
          <Text style={[commonStyles.text, { fontSize: 16 }]}>Tips:</Text>
          <Text style={commonStyles.text}>- Keep a steady rhythm.</Text>
          <Text style={commonStyles.text}>- Use small hops to thread the gap!</Text>
          <Text style={commonStyles.text}>- You have 3 lives, so do not panic!</Text>
        </View>
      </ScrollView>
    </View>
  );
}
