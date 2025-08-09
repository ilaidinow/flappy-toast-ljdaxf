
import { StyleSheet } from 'react-native';

export const colors = {
  // Cute, hand-drawn palette
  background: '#F5F5DC', // Beige like toast
  backgroundAlt: '#FFF7E1', // Lighter cream
  text: '#8B4513', // Dark brown
  primary: '#FFA500', // Orange accent
  secondary: '#FFD700', // Bright yellow accent
  card: '#FFF1C9',
  grey: '#B09060',
  heart: '#FF4D6D',
  obstacle: '#7A7A7A',
  obstacleDark: '#4A4A4A',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#8B4513', // dark brown for strong contrast
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Baloo2_400Regular',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 26,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.12)',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
});
