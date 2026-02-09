import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { colors } from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function VaultScreen() {
    const { user } = useAuth();
    const [echoes, setEchoes] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    useEffect(() => {
        loadEchoes();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
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

    const playEcho = async (item: any) => {
        try {
            if (playingId === item.id && sound) {
                await sound.stopAsync();
                setPlayingId(null);
                return;
            }

            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            // Supabase Storage Logic
            // Assuming 'echoes-audio' is a private bucket, we need a signed URL
            // If the path stored is just the filename or full path, we need to extract filename
            // The RecordScreen saves `data.path`, which is usually `userId/timestamp.m4a`

            const { data, error } = await supabase.storage
                .from('echoes-audio')
                .createSignedUrl(item.audio_url, 3600); // 1 hour link

            if (error || !data?.signedUrl) {
                console.error('Signed URL Error:', error);
                Alert.alert("Error", "Could not load audio file.");
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: data.signedUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
            setPlayingId(item.id);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingId(null);
                }
            });
        } catch (error) {
            console.error('Playback failed', error);
            Alert.alert("Playback Error", "Could not play this Echo.");
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.echoCard}>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => !item.is_locked && playEcho(item)}
                disabled={item.is_locked}
            >
                <Feather
                    name={item.is_locked ? "lock" : (playingId === item.id ? "square" : "play-circle")}
                    size={32}
                    color={item.is_locked ? colors.text.disabled : colors.primary}
                />
            </TouchableOpacity>
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 16,
        padding: 4,
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
