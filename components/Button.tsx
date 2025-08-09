
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
import { colors } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({ text, onPress, style, textStyle, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled ? styles.disabled : null]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.18)',
    elevation: 3,
  },
  buttonText: {
    color: '#2A1600',
    fontSize: 18,
    fontFamily: 'Baloo2_700Bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
