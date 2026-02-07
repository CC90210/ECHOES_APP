import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
    const { user } = useAuth();
    const [weeklyQuestion, setWeeklyQuestion] = useState<any>(null);
    const [stats, setStats] = useState({ echoes: 0, locked: 0 });
    const [refreshing, setRefreshing] = useState(false);

    const loadContent = async () => {
        try {
            // 1. Get a random question (Mock "Weekly" logic for now)
            // In prod, this would be a specific query for the current week's question from a 'weekly_prompts' table
            const { data: questions, error } = await supabase
                .from('questions')
                .select('*')
                .limit(1); // just get one for now

            if (questions && questions.length > 0) {
                setWeeklyQuestion(questions[0]);
            }

            // 2. Get user stats
            if (user) {
                const { count: echoCount } = await supabase
                    .from('echoes')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const { count: lockedCount } = await supabase
                    .from('echoes')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('is_locked', true);

                setStats({
                    echoes: echoCount || 0,
                    locked: lockedCount || 0
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadContent();
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadContent();
        setRefreshing(false);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.heroSection}>
                <Text style={styles.greeting}>Welcome back.</Text>
                <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>QUESTION OF THE WEEK</Text>
                    <Feather name="mic" size={20} color={colors.surface} />
                </View>

                <Text style={styles.questionText}>
                    "{weeklyQuestion?.question_text || 'Loading question...'}"
                </Text>

                <Button
                    title="Record Answer"
                    onPress={() => navigation.navigate('Record', { question: weeklyQuestion })}
                    variant="secondary"
                    disabled={!weeklyQuestion}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Legacy</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{stats.echoes}</Text>
                        <Text style={styles.statLabel}>Echoes</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{stats.locked}</Text>
                        <Text style={styles.statLabel}>Locked</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{stats.echoes > 0 ? 'Active' : 'Empty'}</Text>
                        <Text style={styles.statLabel}>Status</Text>
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
        backgroundColor: colors.primary,
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
