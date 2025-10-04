import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import AccountsScreen from '../screens/Accounts/AccountsScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import PaymentsScreen from '../screens/Payments/PaymentsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { seedIfNeeded } from '../services/mockApi';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FAFAFA',
    primary: '#00695C',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    notification: '#10B981',
  },
};

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Accounts" component={AccountsScreen} />
      <Tabs.Screen name="Transactions" component={TransactionsScreen} />
      <Tabs.Screen name="Payments" component={PaymentsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function RootNavigator() {
  const { member } = useAuth();

  useEffect(() => {
    seedIfNeeded();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {member ? (
        <Stack.Screen name="Main" component={TabsNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer theme={AppTheme}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
