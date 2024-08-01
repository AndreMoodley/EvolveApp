import React, { useLayoutEffect, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { updateExpense, deleteExpense, storeWorkout, updateWorkout, fetchWorkouts, storeExpense } from '../util/http';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { AuthContext } from '../store/auth-context';

function ManageExpense({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const expensesCtx = useContext(ExpensesContext);
  const authCtx = useContext(AuthContext);
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useEffect(() => {
    if (isEditing) {
      fetchWorkouts(editedExpenseId, authCtx.token, authCtx.userId).then(fetchedWorkouts => {
        setWorkouts(fetchedWorkouts);
      });
    }
  }, [isEditing, editedExpenseId, authCtx.token, authCtx.userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId, authCtx.token, authCtx.userId);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error deleting expense:', error);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData, updatedWorkouts, token, userId) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateExpense(editedExpenseId, expenseData, token, userId);
        expensesCtx.updateExpense(editedExpenseId, expenseData);
  
        for (const workout of updatedWorkouts) {
          if (workout.id) {
            await updateWorkout(editedExpenseId, workout.id, workout, token, userId);
          } else {
            await storeWorkout(editedExpenseId, workout, token, userId);
          }
        }
      } else {
        const id = await storeExpense(expenseData, token, userId);
        expensesCtx.addExpense({ ...expenseData, id });
  
        // Store workouts
        for (const workout of updatedWorkouts) {
          await storeWorkout(id, workout, token, userId);
        }
      }
      navigation.goBack();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error in confirmHandler:', error);
    }
  }
  

  if (isSubmitting) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={currentTheme.textPrimary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ExpenseForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={(expenseData, updatedWorkouts) => confirmHandler(expenseData, updatedWorkouts, authCtx.token, authCtx.userId)}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={currentTheme.error}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
