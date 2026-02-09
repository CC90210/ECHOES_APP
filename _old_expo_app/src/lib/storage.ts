import { supabase } from './supabase';

export const uploadAudio = async (uri: string, userId: string): Promise<string | null> => {
    try {
        const filename = `${userId}/${Date.now()}.m4a`;
        const formData = new FormData();

        // React Native expects specific object format for file upload
        const file = {
            uri,
            name: 'audio.m4a',
            type: 'audio/m4a',
        } as any;

        formData.append('file', file);

        // Note: Standard Supabase Storage implementation
        // For large scale (as per spec), we'd use presigned URLs here.
        // This implementation uses Supabase Storage for speed of development/MVP.
        const { data, error } = await supabase.storage
            .from('echoes-audio')
            .upload(filename, file, {
                contentType: 'audio/m4a',
            });

        if (error) {
            console.error('Storage upload error:', error);
            throw error;
        }

        // Get public URL (if public) or signed URL (if private)
        // For ECHOES, we probably want private signed URLs, but for MVP let's store the path
        return data.path;

    } catch (error) {
        console.error('Error uploading audio:', error);
        return null;
    }
};
