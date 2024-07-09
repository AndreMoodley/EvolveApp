import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getTheme } from '../../constants/styles';

function LoadingOverlay({ theme }) {
  const currentTheme = getTheme(theme);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.primary }]}>
      <ActivityIndicator size="large" color={currentTheme.textPrimary} />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
 