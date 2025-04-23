import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import { Ionicons } from '@expo/vector-icons';
import BMICalculator from "../screens/BMICalculator";
import BodyFatCalculator from "../screens/BodyFatCalculator";
import MeditationBreathing from "../screens/MeditationBreathing";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ route }) {

    const { name } = route.params

    return (
        <Tab.Navigator
            id={null}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeScreen') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'ProfileScreen') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} initialParams={{ name }} options={{ title: 'Home' }} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} initialParams={{ name }} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
}

export default function AppNav() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                id={null}
                initialRouteName="LoginScreen"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'rgb(0, 149, 182)',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                } as any}
            >
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BMICalculator"
                    component={BMICalculator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BodyFatCalculator"
                    component={BodyFatCalculator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MeditationBreathing"
                    component={MeditationBreathing}
                    options={{ headerShown: false }}
                />

                
            </Stack.Navigator>
        </NavigationContainer>
    );
}