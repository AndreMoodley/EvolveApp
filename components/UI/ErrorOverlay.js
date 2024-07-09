import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../store/theme-context';
import { getTheme } from '../../constants/styles';

function ErrorOverlay({ message }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.errorBackground }]}>
      <Text style={[styles.title, { color: currentTheme.error }]}>An error occurred!</Text>
      <Text style={[styles.message, { color: currentTheme.error }]}>{message}</Text>
    </View>
  );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
 