import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { fetchExpenses, fetchWorkouts } from '../util/http';

function RecentExpenses() {
  const expensesCtx = useContext(ExpensesContext);
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses();
        const expensesWithWorkouts = await Promise.all(expenses.map(async (expense) => {
          const workouts = await fetchWorkouts(expense.id);
          return { ...expense, workouts: workouts || [] }; // Ensure workouts is an array
        }));
        console.log('Fetched expenses in component:', expensesWithWorkouts);
        expensesCtx.setExpenses(expensesWithWorkouts); 
      } catch (error) {
        setError(error.message);
      }
      setIsFetching(false);
    }

    getExpenses();
  }, []);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = new Date(today.setDate(today.getDate() - 7));

    return expense.date >= date7DaysAgo && expense.date <= new Date();
  });

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ExpensesOutput
        expenses={recentExpenses}
        expensesPeriod="Last 7 Days"
        fallbackText="No expenses registered for the last 7 days."
        theme={theme}
      />
    </View>
  );
}

export default RecentExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
