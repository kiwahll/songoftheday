import axios from 'axios';

interface CachedToken {
    token: string;
    expiresAt: number;
}

let cachedToken: CachedToken | null = null;

export async function getSpotifyToken(): Promise<string> {
    // 1. Prüfen ob gecachter Token noch gültig
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.token;
    }
    
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        throw new Error('Spotify Client ID oder Secret nicht konfiguriert');
    }
    
    try {
        // 2. Neuen Token anfordern
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        // 3. Token cachen (3600s - 60s Puffer)
        cachedToken = {
            token: response.data.access_token,
            expiresAt: Date.now() + (response.data.expires_in - 60) * 1000
        };
        
        return cachedToken.token;
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Ungültige Spotify Client Credentials');
            }
        }
        throw new Error('Fehler beim Abrufen des Spotify Tokens');
    }
}

export async function fetchSpotifyTrack(trackId: string) {
    const token = await getSpotifyToken();
    
    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                // Token可能是无效的，清除缓存并重试
                cachedToken = null;
                throw new Error('Spotify Token ungültig - erneuter Versuch');
            } else if (error.response?.status === 404) {
                throw new Error('Track nicht gefunden');
            }
        }
        throw new Error('Fehler beim Abrufen der Spotify Daten');
    }
}
