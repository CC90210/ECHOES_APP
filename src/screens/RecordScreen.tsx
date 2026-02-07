import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { api, Question } from '../services/api';
import { Feather } from '@expo/vector-icons';

export default function RecordScreen({ route, navigation }: any) {
    const { question } = route.params || { question: { text: "What's on your mind today?" } };
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [duration, setDuration] = useState(0);
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'review'>('idle');
    const [uri, setUri] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (recordingStatus === 'recording') {
            interval = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [recordingStatus]);

    async function startRecording() {
        try {
            if (permissionResponse?.status !== 'granted') {
                const response = await requestPermission();
                if (response.status !== 'granted') return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setRecordingStatus('recording');
            setDuration(0);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setRecording(undefined);
        setRecordingStatus('review');
        await recording?.stopAndUnloadAsync();
        const uri = recording?.getURI();
        setUri(uri || null);
    }

    async function saveEcho() {
        if (uri) {
            await api.echoes.create(uri, question.text, duration);
            navigation.goBack();
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.promptContainer}>
                <Text style={styles.label}>ANSWERING</Text>
                <Text style={styles.question}>{question.text}</Text>
            </View>

            <View style={styles.recorderContainer}>
                <View style={[styles.visualizer, recordingStatus === 'recording' && styles.activeVisualizer]}>
                    <Text style={styles.timer}>{formatTime(duration)}</Text>
                    {recordingStatus === 'recording' && <Text style={styles.recordingIndicator}>● REC</Text>}
                </View>

                <View style={styles.controls}>
                    {recordingStatus === 'idle' && (
                        <Button
                            title="Start Recording"
                            onPress={startRecording}
                            variant="primary" // Changed to primary for contrast
                        />
                    )}

                    {recordingStatus === 'recording' && (
                        <Button
                            title="Stop Recording"
                            onPress={stopRecording}
                            variant="danger"
                        />
                    )}

                    {recordingStatus === 'review' && (
                        <View style={{ width: '100%' }}>
                            <Button
                                title="Save into Vault"
                                onPress={saveEcho}
                                variant="primary"
                            />
                            <Button
                                title="Re-record"
                                onPress={() => setRecordingStatus('idle')}
                                variant="outline"
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
        justifyContent: 'space-between',
    },
    promptContainer: {
        marginTop: 40,
    },
    label: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
    },
    question: {
        fontSize: 28,
        fontWeight: '400',
        color: colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        lineHeight: 36,
    },
    recorderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visualizer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    activeVisualizer: {
        borderColor: colors.error,
        borderWidth: 2,
        backgroundColor: '#FFEBEE', // Light red bg
    },
    timer: {
        fontSize: 48,
        fontWeight: '200',
        color: colors.text.primary,
        fontVariant: ['tabular-nums'],
    },
    recordingIndicator: {
        color: colors.error,
        fontWeight: '700',
        marginTop: 8,
        fontSize: 12,
    },
    controls: {
        width: '100%',
    },
});
