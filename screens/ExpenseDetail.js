import React from 'react';
import { View, Text, SectionList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { getFormattedDate } from '../util/date';
import { ExpensesContext } from '../store/expenses-context';
import { deleteExpense } from '../util/http';
import IconButton from '../components/UI/IconButton';

function ExpenseDetail({ route }) {
  const { expense } = route.params;
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const navigation = useNavigation();
  const expensesCtx = React.useContext(ExpensesContext);

  const sections = [
    { title: 'Expense Details', data: [expense] },
    { title: 'Workouts', data: expense.workouts || [] }, // Ensure workouts is an array
  ];

  function confirmDeleteHandler() {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteExpenseHandler }
      ]
    );
  }

  async function deleteExpenseHandler() {
    try {
      await deleteExpense(expense.id);
      expensesCtx.deleteExpense(expense.id);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not delete expense.');
    }
  }

  function renderExpenseDetail({ item }) {
    return (
      <View style={[styles.detailContainer, { backgroundColor: currentTheme.primary }]}>
        <Text style={[styles.detailText, { color: currentTheme.textPrimary }]}>Description: {item.description}</Text>
        <Text style={[styles.detailText, { color: currentTheme.textPrimary }]}>Rating: {item.rating}/10</Text>
        <Text style={[styles.detailText, { color: currentTheme.textPrimary }]}>Date: {getFormattedDate(item.date)}</Text>
      </View>
    );
  }

  function renderWorkout({ item }) {
    return (
      <View style={[styles.workoutContainer, { backgroundColor: currentTheme.primary }]}>
        <Text style={[styles.workoutText, { color: currentTheme.textPrimary }]}>Name: {item.name}</Text>
        <Text style={[styles.workoutText, { color: currentTheme.textPrimary }]}>Reps: {item.reps}</Text>
        <Text style={[styles.workoutText, { color: currentTheme.textPrimary }]}>RPE: {item.rpe}</Text>
        {item.sets && item.sets.map((set, index) => (
          <View key={index} style={styles.setContainer}>
            <Text style={[styles.setText, { color: currentTheme.textPrimary }]}>Set {index + 1}:</Text>
            <Text style={[styles.setText, { color: currentTheme.textPrimary }]}>Reps: {set.reps}</Text>
            <Text style={[styles.setText, { color: currentTheme.textPrimary }]}>RPE: {set.rpe}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item, section }) =>
          section.title === 'Expense Details' ? renderExpenseDetail({ item }) : renderWorkout({ item })
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: currentTheme.textPrimary }]}>{title}</Text>
        )}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.deleteContainer}>
        <IconButton
          icon="trash"
          color={currentTheme.error}
          size={36}
          onPress={confirmDeleteHandler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
  },
  workoutContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 16,
  },
  setContainer: {
    paddingLeft: 20,
    marginBottom: 5,
  },
  setText: {
    fontSize: 14,
  },
  deleteContainer: {
    marginTop: 16,
    marginBottom: 80,
    paddingTop: 8, 
    alignItems: 'center',
  },
});

export default ExpenseDetail;
