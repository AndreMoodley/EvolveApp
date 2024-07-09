import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../../constants/styles';

function IconButton({ icon, size, color, onPress, theme }) {
  const currentTheme = getTheme(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressed, pressed && { opacity: 0.75 }]}
    >
      <View style={[styles.buttonContainer, { backgroundColor: currentTheme.primary }]}>
        <Ionicons name={icon} size={size} color={color || currentTheme.textPrimary} />
      </View>
    </Pressable>
  );
}
 
export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
