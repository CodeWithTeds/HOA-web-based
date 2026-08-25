import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echo: any;

const reverbKey = (import.meta.env as any).VITE_REVERB_APP_KEY;
const reverbHost = (import.meta.env as any).VITE_REVERB_HOST;
const reverbPort = (import.meta.env as any).VITE_REVERB_PORT;
const reverbScheme = (import.meta.env as any).VITE_REVERB_SCHEME;

function createDummyEcho() {
    const dummyChannel = {
        listen: () => dummyChannel,
        listenForWhisper: () => dummyChannel,
        stopListening: () => dummyChannel,
        subscribed: () => {},
        error: () => {},
    };
    return {
        private: () => dummyChannel,
        channel: () => dummyChannel,
        join: () => dummyChannel,
        leave: () => {},
        disconnect: () => {},
    };
}

try {
    if (reverbKey) {
        echo = new Echo({
            broadcaster: 'reverb',
            key: reverbKey,
            wsHost: reverbHost ?? window.location.hostname,
            wsPort: reverbPort ?? 80,
            wssPort: reverbPort ?? 443,
            forceTLS: (reverbScheme ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    } else {
        console.warn('[Echo] VITE_REVERB_APP_KEY missing — realtime disabled, using dummy echo');
        echo = createDummyEcho();
    }
} catch (e) {
    console.warn('[Echo] Failed to init Reverb/Pusher, falling back to dummy:', e);
    echo = createDummyEcho();
}

export default echo;
