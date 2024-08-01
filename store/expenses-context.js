import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { AuthContext } from './auth-context';
import { fetchExpenses, storeExpense, updateExpense, deleteExpense, storeWorkout } from '../util/http';

export const ExpensesContext = createContext();

const expensesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'SET':
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
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function loadExpenses() {
      if (authCtx.token && authCtx.userId) {
        const expenses = await fetchExpenses(authCtx.token, authCtx.userId);
        dispatch({ type: 'SET', payload: expenses });
      }
    }

    loadExpenses();
  }, [authCtx.token, authCtx.userId]);

  const addExpense = async (expenseData, updatedWorkouts) => {
    const id = await storeExpense({ ...expenseData, userId: authCtx.userId }, authCtx.token);
    dispatch({ type: 'ADD', payload: { ...expenseData, id } });
  
    // Store workouts associated with the expense
    for (const workout of updatedWorkouts) {
      if (workout.name) { // Only store workouts with a name
        await storeWorkout(id, workout, authCtx.token, authCtx.userId);
      }
    }
  
    return id;
  };
  

  const setExpenses = (expenses) => {
    dispatch({ type: 'SET', payload: expenses });
  };

  const updateExpenseHandler = async (id, expenseData) => {
    await updateExpense(id, { ...expenseData, userId: authCtx.userId }, authCtx.token);
    dispatch({ type: 'UPDATE', payload: { id, data: expenseData } });
  };

  const deleteExpenseHandler = async (id) => {
    await deleteExpense(id, authCtx.token, authCtx.userId);
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
