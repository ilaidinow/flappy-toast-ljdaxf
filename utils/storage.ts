
import AsyncStorage from '@react-native-async-storage/async-storage';

const HS_KEY = 'flappy_toast_high_score_v1';

export async function getHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(HS_KEY);
    if (value != null) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  } catch (e) {
    console.log('getHighScore error', e);
    return 0;
  }
}

export async function setHighScore(score: number): Promise<void> {
  try {
    await AsyncStorage.setItem(HS_KEY, String(score));
  } catch (e) {
    console.log('setHighScore error', e);
  }
}
