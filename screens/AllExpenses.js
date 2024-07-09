import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ExpensesSummary from '../components/ExpensesOutput/ExpensesSummary';
import { ExpensesContext } from '../store/expenses-context';
import { useTheme } from '../store/theme-context'; // Import useTheme
import { getTheme } from '../constants/styles';

function AllExpenses() {
  const expensesCtx = useContext(ExpensesContext);
  const { theme } = useTheme(); // Use theme from context
  const currentTheme = getTheme(theme);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}> 
      <ExpensesOutput expenses={expensesCtx.expenses} expensesPeriod="Total" fallbackText="No registered expenses found." theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});
 
export default AllExpenses;
