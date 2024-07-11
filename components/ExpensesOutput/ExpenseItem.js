import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTheme } from '../../constants/styles';
import { getFormattedDate } from '../../util/date';
import { useTheme } from '../../store/theme-context';

function ExpenseItem({ id, description, rating, date, workouts = [], theme }) {
  const navigation = useNavigation();
  const { theme: contextTheme } = useTheme();
  const currentTheme = getTheme(theme || contextTheme);

  function expensePressHandler() {
    navigation.navigate('ExpenseDetail', {
      expense: { id, description, rating, date, workouts }
    });
  }

  return (
    <Pressable onPress={expensePressHandler} style={({ pressed }) => [styles.pressed, pressed && { opacity: 0.75 }]}>
      <View style={[styles.expenseItem, { backgroundColor: currentTheme.primary800 }]}>
        <View>
          <Text style={[styles.textBase, styles.description, { color: currentTheme.textPrimary }]}>{description}</Text>
          <Text style={[styles.textBase, { color: currentTheme.textPrimary }]}>{getFormattedDate(date)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: currentTheme.primary800 }]}>{rating}/10</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ExpenseItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  expenseItem: {
    padding: 12,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textBase: {
    fontSize: 16,
  },
  description: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    fontWeight: 'bold',
  },
});
