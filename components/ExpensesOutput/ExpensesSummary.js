import { View, Text, StyleSheet } from 'react-native';
import { getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function ExpensesSummary({ expenses, periodName }) {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.primaryLight }]}>
      <Text style={[styles.period, { color: currentTheme.textPrimary }]}>{periodName}</Text>
      <Text style={[styles.sum, { color: currentTheme.primary }]}>{}</Text>
    </View>
  );
}

export default ExpensesSummary;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  period: {
    fontSize: 12,
  },
  sum: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
