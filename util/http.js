import axios from 'axios';

const BACKEND_URL = 'https://one-of-wun-default-rtdb.firebaseio.com/';

// Expense-related functions
export async function storeExpense(expenseData) {
  console.log("TRIED AT SOURCE");
  const response = await axios.post(BACKEND_URL + '/expenses.json', {
    rating: expenseData.rating,
    date: expenseData.date,
    description: expenseData.description
  });
  const id = response.data.name;
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(BACKEND_URL + '/expenses.json');

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      rating: response.data[key].rating,
      date: new Date(response.data[key].date),
      description: response.data[key].description
    };
    expenses.push(expenseObj);
  } 

  return expenses;
}

export function updateExpense(id, expenseData) {
  return axios.put(BACKEND_URL + `/expenses/${id}.json`, {
    rating: expenseData.rating,
    date: expenseData.date,
    description: expenseData.description
  });
}

export function deleteExpense(id) {
  return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}

// Workout-related functions
export async function storeWorkout(expenseId, workoutData) {
  const response = await axios.post(BACKEND_URL + `/workouts/${expenseId}.json`, workoutData);
  const id = response.data.name;
  return id;
}

export async function fetchWorkouts(expenseId) {
  const response = await axios.get(BACKEND_URL + `/workouts/${expenseId}.json`);

  const workouts = [];

  for (const key in response.data) {
    const workoutObj = {
      id: key,
      ...response.data[key]
    };
    workouts.push(workoutObj);
  }

  return workouts;
}

export function updateWorkout(expenseId, workoutId, workoutData) {
  return axios.put(BACKEND_URL + `/workouts/${expenseId}/${workoutId}.json`, workoutData);
}

export function deleteWorkout(expenseId, workoutId) {
  return axios.delete(BACKEND_URL + `/workouts/${expenseId}/${workoutId}.json`);
}

// Vow-related functions
export async function storeVow(vowData) {
  const response = await axios.post(BACKEND_URL + '/vows.json', vowData);
  const id = response.data.name;
  return id;
}

export async function fetchVows() {
  const response = await axios.get(BACKEND_URL + '/vows.json');

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
}

export function updateVow(id, vowData) {
  return axios.put(BACKEND_URL + `/vows/${id}.json`, vowData);
}

export function deleteVow(id) {
  return axios.delete(BACKEND_URL + `/vows/${id}.json`);
}

// Progression-related functions
export async function storeProgression(vowId, progressionData) {
  const response = await axios.post(BACKEND_URL + `/progressions/${vowId}.json`, progressionData);
  const id = response.data.name;
  return id;
}

export async function fetchProgressions(vowId) {
  const response = await axios.get(BACKEND_URL + `/progressions/${vowId}.json`);

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
}

export function updateProgression(vowId, progressionId, progressionData) {
  return axios.put(BACKEND_URL + `/progressions/${vowId}/${progressionId}.json`, progressionData);
}

export function deleteProgression(vowId, progressionId) {
  return axios.delete(BACKEND_URL + `/progressions/${vowId}/${progressionId}.json`);
}
