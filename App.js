import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import ManageExpense from './screens/ManageExpense';
import RecentExpenses from './screens/RecentExpenses';
import AllExpenses from './screens/AllExpenses';
import CustomCalendar from './screens/CustomCalendar';
import EditExpenseScreen from './screens/EditExpenseScreen';
import Profile from './screens/Profile';
import ExpenseDetail from './screens/ExpenseDetail';
import BindingVow from './screens/BindingVow';
import BindingVowForm from './screens/BindingVowForm';
import ProgressionsOverview from './screens/ProgressionsOverview';
import VowDetail from './screens/VowDetail';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import IconButton from './components/UI/IconButton';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import ExpensesContextProvider from './store/expenses-context';
import { ThemeProvider, useTheme } from './store/theme-context';
import CalendarContextProvider from './store/calendar-context';
import { GlobalStyles, getTheme } from './constants/styles';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

function AuthStack() {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.dark.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.dark.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function ExpensesOverview() {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const authCtx = useContext(AuthContext);

  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: currentTheme.primary },
        headerTintColor: currentTheme.textPrimary,
        tabBarStyle: { backgroundColor: currentTheme.primary },
        tabBarActiveTintColor: currentTheme.accent,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageExpense', {
                expenseId: null,
                description: '',
                rating: 0,
                date: new Date().toISOString(),
                workouts: [],
                theme,
              });
            }}
            theme={theme}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name="RecentExpenses"
        options={{
          title: 'Recent Expenses',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      >
        {(props) => <RecentExpenses {...props} theme={theme} />}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="Progressions"
        options={{
          title: 'Progressions',
          tabBarLabel: 'Progressions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="infinite-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <ProgressionsOverview {...props} theme={theme} />}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="BindingVow"
        options={{
          title: 'Binding Vow',
          tabBarLabel: 'Binding Vow',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="diamond-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <BindingVow {...props} theme={theme} />}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="Calendar"
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      >
        {(props) => <CustomCalendar {...props} theme={theme} />}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      >
        {(props) => <Profile {...props} theme={theme} />}
      </BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.dark.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.dark.primaryLight },
      }}
    >
      <Stack.Screen
        name="ExpensesOverview"
        options={{ headerShown: false }}
      >
        {(props) => <ExpensesOverview {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Calendar"
        options={{
          presentation: 'modal',
        }}
      >
        {(props) => <CustomCalendar {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="ManageExpense"
        options={{
          presentation: 'modal',
        }}
      >
        {(props) => <ManageExpense {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetail}
        options={{ title: 'Expense Details' }}
      />
      <Stack.Screen
        name="EditExpenseScreen"
        component={EditExpenseScreen}
        options={{ title: 'Edit Expense' }}
      />
      <Stack.Screen
        name="BindingVowForm"
        component={BindingVowForm}
        options={{ title: 'Add Binding Vow' }}
      />
      <Stack.Screen
        name="VowDetail"
        component={VowDetail}
        options={{ title: 'Vow Details' }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}
function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedExpirationDate = await AsyncStorage.getItem('tokenExpiration');

      if (storedToken && storedUserId && storedExpirationDate) {
        const expirationDate = new Date(storedExpirationDate);
        const remainingTime = expirationDate.getTime() - new Date().getTime();

        if (remainingTime <= 60000) {
          // Less than 1 minute, refresh token
          try {
            const newToken = await fetchNewToken();
            authCtx.authenticate(newToken, storedUserId);
          } catch (error) {
            console.error('Error refreshing token:', error);
            authCtx.logout();
          }
        } else {
          authCtx.authenticate(storedToken, storedUserId);
          setTimeout(authCtx.logout, remainingTime); // Auto-logout after token expires
        }
      } else {
        authCtx.logout();
      }

      setIsTryingLogin(false);
      SplashScreen.hideAsync(); // Hide the splash screen once the token is fetched
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return null; // Render nothing while checking the token
  }

  return <Navigation />;
}


export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <ThemeProvider>
        <AuthContextProvider>
          <ExpensesContextProvider>
            <CalendarContextProvider>
              <Root />
            </CalendarContextProvider>
          </ExpensesContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}
