import React, { useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { ExpensesContext } from '../store/expenses-context';
import { getFormattedDate } from '../util/date';

function Calendar() {
  const expensesCtx = useContext(ExpensesContext);

  const items = {};
 
  expensesCtx.expenses.forEach((expense) => {
    const dateStr = getFormattedDate(expense.date);
    if (!items[dateStr]) {
      items[dateStr] = [];
    }
    items[dateStr].push({
      name: expense.description,
      amount: expense.amount,
      id: expense.id,
    });
  });

  function renderItem(item) {
    return (
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>${item.amount.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }

  let content = <Text style={styles.infoText}>{"No registered expenses found!"}</Text>;

  if (expensesCtx.expenses.length > 0) {
    content = (
      <Agenda
        items={items}
        renderItem={renderItem}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 40,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    marginBottom: 32,
  },
});

export default Calendar;
