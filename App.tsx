import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RecordScreen from './src/screens/RecordScreen';
import VaultScreen from './src/screens/VaultScreen';
import { colors } from './src/theme/colors';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

function NavigationContent() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.primary,
                    headerTitleStyle: { fontWeight: 'bold' },
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                {!session ? (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ECHOES' }} />
                        <Stack.Screen name="Record" component={RecordScreen} options={{ title: 'New Echo' }} />
                        <Stack.Screen name="Vault" component={VaultScreen} options={{ title: 'Your Vault' }} />
                    </>
                )}
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NavigationContent />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
