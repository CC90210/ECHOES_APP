import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                Alert.alert('Success', 'Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
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
                    placeholderTextColor={colors.text.disabled}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.text.disabled}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title={isSignUp ? "Create Account" : "Sign In"}
                    onPress={handleAuth}
                    loading={loading}
                />

                <Text
                    style={styles.footerText}
                    onPress={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <Text style={styles.link}>{isSignUp ? "Sign In" : "Sign Up"}</Text>
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
        color: colors.text.primary,
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
