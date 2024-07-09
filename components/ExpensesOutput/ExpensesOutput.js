import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ExpensesList from './ExpensesList';
import ExpensesSummary from './ExpensesSummary';
import { getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function ExpensesOutput({ expenses, expensesPeriod, fallbackText, theme }) {
  const { theme: contextTheme } = useTheme();
  const currentTheme = getTheme(theme || contextTheme);

  let content = (
    <Text style={[styles.infoText, { color: currentTheme.textPrimary }]}>
      {fallbackText}
    </Text>
  );

  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} theme={theme || contextTheme} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ExpensesSummary expenses={expenses} periodName={expensesPeriod} theme={theme || contextTheme} />
      {content}
    </View>
  );
}

export default ExpensesOutput;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 32,
  },
});
