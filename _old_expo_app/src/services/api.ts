// Mock API service for MVP development

export interface User {
    id: string;
    email: string;
    full_name: string;
}

export interface Echo {
    id: string;
    user_id: string;
    question_text: string;
    audio_url: string; // S3 URL
    duration_seconds: number;
    recorded_at: string; // ISO date
    unlock_date?: string;
    is_locked: boolean;
}

export interface Question {
    id: number;
    category: string;
    text: string;
}

// Mock Data
const MOCK_USER: User = {
    id: 'user-123',
    email: 'test@example.com',
    full_name: 'Test User',
};

const MOCK_QUESTIONS: Question[] = [
    { id: 1, category: 'Identity', text: 'Who are you when no one is watching?' },
    { id: 2, category: 'Legacy', text: 'What do you want your great-grandchildren to know about you?' },
];

const MOCK_ECHOES: Echo[] = [
    {
        id: 'echo-1',
        user_id: 'user-123',
        question_text: 'What do you want your great-grandchildren to know about you?',
        audio_url: 'https://example.com/audio1.m4a',
        duration_seconds: 125,
        recorded_at: '2025-12-01T10:00:00Z',
        is_locked: false,
    },
];

export const api = {
    auth: {
        login: async (email: string, password: string): Promise<User> => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return MOCK_USER;
        },
        register: async (email: string, password: string): Promise<User> => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return MOCK_USER;
        },
    },
    questions: {
        getWeekly: async (): Promise<Question> => {
            return MOCK_QUESTIONS[0];
        },
        getAll: async (): Promise<Question[]> => {
            return MOCK_QUESTIONS;
        }
    },
    echoes: {
        getAll: async (): Promise<Echo[]> => {
            return MOCK_ECHOES;
        },
        create: async (audioUri: string, questionText: string, duration: number): Promise<Echo> => {
            const newEcho: Echo = {
                id: `echo-${Date.now()}`,
                user_id: MOCK_USER.id,
                question_text: questionText,
                audio_url: audioUri, // In real app, this would be the S3 URL
                duration_seconds: duration,
                recorded_at: new Date().toISOString(),
                is_locked: true, // Default to locked
            };
            MOCK_ECHOES.push(newEcho);
            return newEcho;
        }
    }
};
