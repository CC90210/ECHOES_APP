import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { colors } from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function VaultScreen() {
    const { user } = useAuth();
    const [echoes, setEchoes] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadEchoes();
    }, [user]);

    const loadEchoes = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('echoes')
                .select('*')
                .eq('user_id', user.id)
                .order('recorded_at', { ascending: false });

            if (data) setEchoes(data);
        } catch (e) {
            console.error(e);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEchoes();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.echoCard}>
            <View style={styles.iconContainer}>
                <Feather
                    name={item.is_locked ? "lock" : "play-circle"}
                    size={24}
                    color={item.is_locked ? colors.text.disabled : colors.primary}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.echoTitle} numberOfLines={1}>{item.question_text}</Text>
                <Text style={styles.echoMeta}>
                    {new Date(item.recorded_at).toLocaleDateString()} • {Math.floor(item.duration_seconds / 60)}m {item.duration_seconds % 60}s
                </Text>
            </View>
            {item.is_locked && (
                <View style={styles.lockedBadge}>
                    <Text style={styles.lockedText}>LOCKED</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>ARCHIVE</Text>
                <Text style={styles.title}>All Echoes</Text>
            </View>

            <FlatList
                data={echoes}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No Echoes yet. Record your first one!</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 24,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.text.secondary,
        letterSpacing: 1,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
    },
    list: {
        padding: 16,
    },
    echoCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconContainer: {
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    echoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    echoMeta: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    lockedBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    lockedText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.text.disabled,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.text.secondary,
        fontSize: 16,
        textAlign: 'center',
    }
});
