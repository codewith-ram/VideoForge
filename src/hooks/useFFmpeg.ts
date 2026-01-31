import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const useFFmpeg = () => {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    // Use a ref to persist the FFmpeg instance across renders
    const ffmpegRef = useRef(new FFmpeg());

    const load = useCallback(async () => {
        if (loaded) return;
        setIsLoading(true);
        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;

        // Attach event listeners
        ffmpeg.on('log', ({ message }) => {
            setMessage(prev => `${prev}\n> ${message}`);
        });

        ffmpeg.on('progress', ({ progress }) => {
            // Progress is usually 0 to 1
            setProgress(Math.max(0, Math.min(100, Math.round(progress * 100))));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
            });
            setLoaded(true);
            setMessage('FFmpeg loaded successfully. Ready to convert.');
        } catch (error) {
            console.error(error);
            setMessage(`Error loading FFmpeg: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    }, [loaded]);

    return {
        ffmpeg: ffmpegRef.current,
        loaded,
        isLoading,
        message,
        progress,
        load,
        setMessage,
        setProgress
    };
};
