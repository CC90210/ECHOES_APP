import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { api } from '../services/api';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await api.auth.login(email, password);
            // Navigate to Home
            navigation.replace('Home');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>ECHOES</Text>
                <Text style={styles.subtitle}>Your voice shouldn't disappear when you do.</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    loading={loading}
                />

                <Text style={styles.footerText}>
                    Don't have an account? <Text style={styles.link}>Sign Up</Text>
                </Text>
            </View>
            <StatusBar style="dark" />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: 2,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    form: {
        width: '100%',
    },
    input: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    footerText: {
        marginTop: 16,
        textAlign: 'center',
        color: colors.text.secondary,
    },
    link: {
        color: colors.primary,
        fontWeight: '600',
    }
});
