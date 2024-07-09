import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';

function Profile() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = getTheme(theme);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.text, { color: currentTheme.textPrimary }]}>Select Theme</Text>
      <View style={styles.buttonsContainer}>
        <Button
          title="Light Theme"
          onPress={() => toggleTheme('light')}
          color={currentTheme.primary}
        />
        <Button
          title="Dark Theme"
          onPress={() => toggleTheme('dark')}
          color={currentTheme.primary}
        />
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 20,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default Profile;
