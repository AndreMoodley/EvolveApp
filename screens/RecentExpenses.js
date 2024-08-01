import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { fetchExpenses, fetchWorkouts } from '../util/http';
import { AuthContext } from '../store/auth-context';

function RecentExpenses() {
  const expensesCtx = useContext(ExpensesContext);
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const userId = authCtx.userId;

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses(token, userId);
        const expensesWithWorkouts = await Promise.all(expenses.map(async (expense) => {
          const workouts = await fetchWorkouts(expense.id, token, userId);
          return { ...expense, workouts: workouts || [] };
        }));
        expensesCtx.setExpenses(expensesWithWorkouts);
      } catch (error) {
        setError(error.message);
      }
      setIsFetching(false);
    }

    getExpenses();
  }, [token, userId]);


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
