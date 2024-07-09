import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useTheme } from '../store/theme-context';
import { getTheme } from '../constants/styles';
import { getFormattedDate } from '../util/date';

function ExpenseDetail({ route }) {
  const { expense } = route.params;
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  const sections = [
    { title: 'Expense Details', data: [expense] },
    { title: 'Workouts', data: expense.workouts || [] }, // Ensure workouts is an array
  ];

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
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={({ item, section }) =>
        section.title === 'Expense Details' ? renderExpenseDetail({ item }) : renderWorkout({ item })
      }
      renderSectionHeader={({ section: { title } }) => (
        <Text style={[styles.sectionHeader, { color: currentTheme.textPrimary }]}>{title}</Text>
      )}
      contentContainerStyle={[styles.container, { backgroundColor: currentTheme.background }]}
    />
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
});

export default ExpenseDetail;
 