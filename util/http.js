import axios from 'axios';

const BACKEND_URL = 'https://one-of-wun-default-rtdb.firebaseio.com/';

// Expense-related functions
export async function storeExpense(expenseData, token, userId) {
  try {
    console.log(`Storing expense with token: ${token}, with userID: ${userId}`);
    const response = await axios.post(`${BACKEND_URL}/expenses/${userId}.json?auth=${token}`, {
      rating: expenseData.rating,
      date: expenseData.date,
      description: expenseData.description,
    });
    const id = response.data.name;
    return id;
  } catch (error) {
    console.error('Error storing expense:', error);
    throw error;
  }
}

export async function fetchExpenses(token, userId) {
  try {
    console.log(`Fetching expenses with token: ${token}, with userID: ${userId}`);
    const response = await axios.get(`${BACKEND_URL}/expenses/${userId}.json?auth=${token}`);
    const expenses = [];

    for (const key in response.data) {
      const expenseObj = {
        id: key,
        rating: response.data[key].rating,
        date: new Date(response.data[key].date),
        description: response.data[key].description,
      };
      expenses.push(expenseObj);
    }

    return expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export function updateExpense(id, expenseData, token, userId) {
  try {
    console.log(`Updating expense with token: ${token}, with userID: ${userId}`);
    return axios.put(`${BACKEND_URL}/expenses/${userId}/${id}.json?auth=${token}`, {
      rating: expenseData.rating,
      date: expenseData.date,
      description: expenseData.description,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

export function deleteExpense(id, token, userId) {
  try {
    console.log(`Deleting expense with token: ${token}, with userID: ${userId}`);
    return axios.delete(`${BACKEND_URL}/expenses/${userId}/${id}.json?auth=${token}`);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}

// Workout-related functions
export async function storeWorkout(expenseId, workoutData, token, userId) {
  try {
    console.log(`Storing workout for expenseId: ${expenseId} with token: ${token}, with userID: ${userId}`);
    const response = await axios.post(`${BACKEND_URL}/workouts/${userId}/${expenseId}.json?auth=${token}`, workoutData);
    const id = response.data.name;
    return id;
  } catch (error) {
    console.error('Error storing workout:', error);
    throw error;
  }
}


export async function fetchWorkouts(expenseId, token, userId) {
  try {
    console.log(`Fetching workouts with token: ${token}, with userID: ${userId}`);
    const response = await axios.get(`${BACKEND_URL}/workouts/${userId}/${expenseId}.json?auth=${token}`);
    const workouts = [];

    for (const key in response.data) {
      const workoutObj = {
        id: key,
        ...response.data[key],
      };
      workouts.push(workoutObj);
    }

    return workouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
}

export function updateWorkout(expenseId, workoutId, workoutData, token, userId) {
  try {
    console.log(`Updating workout with token: ${token}, with userID: ${userId}`);
    return axios.put(`${BACKEND_URL}/workouts/${userId}/${expenseId}/${workoutId}.json?auth=${token}`, workoutData);
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
}

export function deleteWorkout(expenseId, workoutId, token, userId) {
  try {
    console.log(`Deleting workout with token: ${token}, with userID: ${userId}`);
    return axios.delete(`${BACKEND_URL}/workouts/${userId}/${expenseId}/${workoutId}.json?auth=${token}`);
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}

// Vow-related functions
export async function storeVow(vowData, token, userId) {
  try {
    console.log(`Storing vow with token: ${token}, with userID: ${userId}`);
    const response = await axios.post(`${BACKEND_URL}/vows/${userId}.json?auth=${token}`, vowData);
    const id = response.data.name;
    return id;
  } catch (error) {
    console.error('Error storing vow:', error);
    throw error;
  }
}

export async function fetchVows(token, userId) {
  if (!token || !userId) {
    throw new Error('Invalid token or userId');
  }

  try {
    console.log(`Fetching vows with token: ${token}, with userID: ${userId}`);
    const response = await axios.get(`${BACKEND_URL}/vows/${userId}.json?auth=${token}`);
    const vows = [];

    for (const key in response.data) {
      const vowObj = {
        id: key,
        title: response.data[key].title,
        description: response.data[key].description,
        date: new Date(response.data[key].date),
        startDate: new Date(response.data[key].startDate),
        type: response.data[key].type,
      };
      vows.push(vowObj);
    }

    return vows;
  } catch (error) {
    console.error('Error fetching vows:', error);
    throw error;
  }
}


export function updateVow(id, vowData, token, userId) {
  try {
    console.log(`Updating vow with token: ${token}, with userID: ${userId}`);
    return axios.put(`${BACKEND_URL}/vows/${userId}/${id}.json?auth=${token}`, vowData);
  } catch (error) {
    console.error('Error updating vow:', error);
    throw error;
  }
}

export function deleteVow(id, token, userId) {
  try {
    console.log(`Deleting vow with token: ${token}, with userID: ${userId}`);
    return axios.delete(`${BACKEND_URL}/vows/${userId}/${id}.json?auth=${token}`);
  } catch (error) {
    console.error('Error deleting vow:', error);
    throw error;
  }
}

// Progression-related functions
export async function storeProgression(vowId, progressionData, token, userId) {
  try {
    console.log(`Storing progression with token: ${token}, with userID: ${userId}`);
    const response = await axios.post(`${BACKEND_URL}/progressions/${userId}/${vowId}.json?auth=${token}`, progressionData);
    const id = response.data.name;
    return id;
  } catch (error) {
    console.error('Error storing progression:', error);
    throw error;
  }
}

export async function fetchProgressions(vowId, token, userId) {
  try {
    console.log(`Fetching progressions with token: ${token}, with userID: ${userId}`);
    const response = await axios.get(`${BACKEND_URL}/progressions/${userId}/${vowId}.json?auth=${token}`);
    const progressions = [];

    for (const key in response.data) {
      const progressionObj = {
        id: key,
        text: response.data[key].text,
        completedDate: response.data[key].completedDate ? new Date(response.data[key].completedDate) : null,
      };
      progressions.push(progressionObj);
    }

    return progressions;
  } catch (error) {
    console.error('Error fetching progressions:', error);
    throw error;
  }
}

export function updateProgression(vowId, progressionId, progressionData, token, userId) {
  try {
    console.log(`Updating progression with token: ${token}, with userID: ${userId}`);
    return axios.put(`${BACKEND_URL}/progressions/${userId}/${vowId}/${progressionId}.json?auth=${token}`, progressionData);
  } catch (error) {
    console.error('Error updating progression:', error);
    throw error;
  }
}

export function deleteProgression(vowId, progressionId, token, userId) {
  try {
    console.log(`Deleting progression with token: ${token}, with userID: ${userId}`);
    return axios.delete(`${BACKEND_URL}/progressions/${userId}/${vowId}/${progressionId}.json?auth=${token}`);
  } catch (error) {
    console.error('Error deleting progression:', error);
    throw error;
  }
}
