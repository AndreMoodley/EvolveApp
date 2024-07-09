import React from 'react';
import { FlatList } from 'react-native';
import ExpenseItem from './ExpenseItem';

function renderExpenseItem(itemData, theme) {
  return <ExpenseItem {...itemData.item} theme={theme} />;
}
 
function ExpensesList({ expenses, theme }) {
  return (
    <FlatList
      data={expenses}
      renderItem={(itemData) => renderExpenseItem(itemData, theme)}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;
