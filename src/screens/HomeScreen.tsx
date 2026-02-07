import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { api, Question } from '../services/api';
import { Feather } from '@expo/vector-icons'; // Need to ensure expo/vector-icons is installed

export default function HomeScreen({ navigation }: any) {
    const [weeklyQuestion, setWeeklyQuestion] = useState<Question | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        const q = await api.questions.getWeekly();
        setWeeklyQuestion(q);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.heroSection}>
                <Text style={styles.greeting}>Welcome back, Conaugh.</Text>
                <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>QUESTION OF THE WEEK</Text>
                    <Feather name="mic" size={20} color={colors.primary} />
                </View>

                <Text style={styles.questionText}>
                    "{weeklyQuestion?.text}"
                </Text>

                <Button
                    title="Record Answer"
                    onPress={() => navigation.navigate('Record', { question: weeklyQuestion })}
                    variant="secondary"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Legacy</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Echoes</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>4</Text>
                        <Text style={styles.statLabel}>Locked</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>1h</Text>
                        <Text style={styles.statLabel}>Recorded</Text>
                    </View>
                </View>
            </View>

            <Button
                title="View Vault"
                variant="outline"
                onPress={() => navigation.navigate('Vault')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
    },
    heroSection: {
        marginBottom: 32,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 8,
    },
    date: {
        fontSize: 16,
        color: colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: colors.primary, // Deep blue card
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    questionText: {
        fontSize: 24,
        color: '#FFF',
        fontStyle: 'italic',
        lineHeight: 32,
        marginBottom: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        width: '30%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 4,
    },
});
