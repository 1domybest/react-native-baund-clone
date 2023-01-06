import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, {useEffect} from 'react'
import { ThemeProvider, Button, createTheme, useThemeMode } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../screens/auth/IndexScreen'
import {ROUTES} from '../constants/routes'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import TestScreen from '../screens/auth/TestScreen'
import { FadeIn, FadeInDown } from 'react-native-reanimated';
const Stack = createNativeStackNavigator();

const theme = createTheme({
  lightColors: {
    primary: '#899656',
    error: 'rgb(255, 25, 12)'
  },
  darkColors: {
    primary: '#344512',
    error: 'rgb(255, 25, 12)'
  },
  mode: 'light',
});



const config = {
  animation: 'spring',
  config: {
    stiffness: 11000,
    damping: 1500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const screenOption = {
    headerShown: false,
    headerShown: true,
    headerBackTitleVisible: false,
    headerTintColor: 'black',
    gestureEnabled: true,
    transitionSpec: {
      open: config,
      close: config,
    },
}

let initialRouteName = ROUTES.INDEX

const AuthNavigation = () => {
  return (
    <ThemeProvider theme={theme}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={ROUTES.INDEX} screenOptions={screenOption}>
                 <Stack.Screen name={ROUTES.INDEX} component={IndexScreen} options={{headerShown: false}}/>
                 <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{headerShown: true, headerTitle: '이메일로 로그인', headerTitleAlign: 'left', }} />
                 <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.TEST} component={TestScreen}  options={{headerShown: true, headerTitle: '',}} />
            </Stack.Navigator>
        </NavigationContainer>
  </ThemeProvider>
  )
}

export default AuthNavigation