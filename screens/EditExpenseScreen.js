import React, { useLayoutEffect, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { updateExpense, deleteExpense, storeWorkout, updateWorkout, fetchWorkouts } from '../util/http';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';

function EditExpenseScreen({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const expensesCtx = useContext(ExpensesContext);
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (isEditing) {
      fetchWorkouts(editedExpenseId).then(fetchedWorkouts => {
        setWorkouts(fetchedWorkouts);
      });
    }
  }, [isEditing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData, updatedWorkouts) {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateExpense(editedExpenseId, expenseData);
        expensesCtx.updateExpense(editedExpenseId, expenseData);

        for (const workout of updatedWorkouts) {
          if (workout.id) {
            await updateWorkout(editedExpenseId, workout.id, workout);
          } else {
            await storeWorkout(editedExpenseId, workout);
          }
        }
      } else {
        const id = await expensesCtx.addExpense(expenseData, updatedWorkouts);
        console.log('Stored expense with ID:', id);
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
        onSubmit={confirmHandler}
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

export default EditExpenseScreen;

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
