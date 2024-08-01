import axios from 'axios';

const API_KEY = 'AIzaSyCSyqsJy0Gjocb-ByfIkeeMNaf8_vzGvSk';
const FIREBASE_REFRESH_TOKEN_URL = 'https://securetoken.googleapis.com/v1/token?key=' + API_KEY;

export async function createUser(email, password) {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );

    const token = response.data.idToken;
    const userId = response.data.localId;
    const refreshToken = response.data.refreshToken;

    return { token, userId, refreshToken };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    console.log("login?");
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );

    const token = response.data.idToken;
    const userId = response.data.localId;
    const refreshToken = response.data.refreshToken;

    return { token, userId, refreshToken };
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error);
    throw error;
  }
}

export async function refreshToken(refreshToken) {
  try {
    console.log("refreshing?");
    const response = await axios.post(FIREBASE_REFRESH_TOKEN_URL, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const newAuthToken = response.data.id_token;
    const newRefreshToken = response.data.refresh_token;
    const expiresIn = response.data.expires_in * 1000;

    // Store new tokens and expiration date
    const expirationDate = new Date(new Date().getTime() + expiresIn);

    await AsyncStorage.setItem('token', newAuthToken);
    await AsyncStorage.setItem('refreshToken', newRefreshToken);
    await AsyncStorage.setItem('tokenExpiration', expirationDate.toISOString());

    return newAuthToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}
