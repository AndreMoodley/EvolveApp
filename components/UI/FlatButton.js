import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../store/theme-context';
import { GlobalStyles, getTheme } from '../../constants/styles';
import { useState, useMemo } from 'react';

function FlatButton({ children, onPress }) {
    const { theme } = useTheme();
    const currentTheme = useMemo(() => getTheme(theme), [theme]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: currentTheme.primaryLight },
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, { color: currentTheme.textPrimary }]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
 