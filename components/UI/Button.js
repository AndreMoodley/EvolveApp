import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTheme } from '../../constants/styles';

function Button({ children, onPress, mode, style, theme }) {
  const currentTheme = getTheme(theme);

  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressed, pressed && { backgroundColor: currentTheme.primaryLight }]}
      >
        <View style={[styles.button, mode === 'flat' && styles.flat]}>
          <Text style={[styles.buttonText, mode === 'flat' && styles.flatText, { color: currentTheme.textPrimary }]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
 
export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
  },
  flat: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    textAlign: 'center',
  },
  flatText: {
    color: 'gray',
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 4,
  },
});
