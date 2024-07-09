import React, { createContext, useReducer, useEffect } from 'react';
import { fetchExpenses, storeExpense, updateExpense, deleteExpense, storeWorkout } from '../util/http';

export const ExpensesContext = createContext();

const expensesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      console.log('Adding expense to state:', action.payload);
      return [action.payload, ...state];
    case 'SET':
      console.log('Setting expenses:', action.payload);
      return action.payload.reverse(); // Assuming you want to show the most recent first
    case 'UPDATE':
      const updatableExpenseIndex = state.findIndex(expense => expense.id === action.payload.id);
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case 'DELETE':
      return state.filter(expense => expense.id !== action.payload);
    default:
      return state;
  }
};

const ExpensesContextProvider = ({ children }) => {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  useEffect(() => {
    async function loadExpenses() {
      const expenses = await fetchExpenses();
      console.log('Fetched expenses:', expenses);
      dispatch({ type: 'SET', payload: expenses });
    }

    loadExpenses();
  }, []);

  const addExpense = async (expenseData, updatedWorkouts) => {
    const id = await storeExpense(expenseData);
    console.log('Stored expense with ID:', id);
    dispatch({ type: 'ADD', payload: { ...expenseData, id } });

    // Store workouts
    for (const workout of updatedWorkouts) {
      await storeWorkout(id, workout);
    }
 
    return id;
  };

  const setExpenses = (expenses) => {
    console.log('Setting expenses in context:', expenses);
    dispatch({ type: 'SET', payload: expenses });
  };

  const updateExpenseHandler = async (id, expenseData) => {
    await updateExpense(id, expenseData);
    dispatch({ type: 'UPDATE', payload: { id, data: expenseData } });
  };

  const deleteExpenseHandler = async (id) => {
    await deleteExpense(id);
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses: expensesState,
        addExpense,
        setExpenses,
        updateExpense: updateExpenseHandler,
        deleteExpense: deleteExpenseHandler,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export default ExpensesContextProvider;
