import { View, Text } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from "react-native-vector-icons/Ionicons";
import {ROUTES} from '../constants/routes'
import HomeScreen from '../screens/main/HomeScreen'
const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator initialRouteName={ROUTES.HOME} 
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#61616236',
        height: 90,    
        padding: 10,
        backgroundColor: "white",
    },
      tabBarIcon: ({color, size, focused}) => {
        let tab = {
          icon: '',
          name: ''
        };
        if (route.name === ROUTES.HOME) {
          tab.icon = focused ? "home" : "home";
          tab.name = '홈'
        }

        return (
          <>
          <Ionicons name={tab.icon} size={28} color="black"/>
          <Text style={{color: 'black', marginTop: 3,}}>{tab.name}</Text>
          </>
        )
      }
    })}>
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} ></Tab.Screen>
    </Tab.Navigator>
  )
}

export default MainNavigation

const useStyles = makeStyles((theme, props) => ({
}));