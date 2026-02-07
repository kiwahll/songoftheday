import { SongPlatform } from "./models/Entry";
import { fetchSpotifyTrack } from "./spotify";

export async function createSpotifyTrackData(url: string) {

    const trackId = extractSpotifyId(url);
    if (!trackId) {
        return null;
    }

    const data = await fetchSpotifyTrack(trackId);
    return {
        platform: SongPlatform.SPOTIFY,
        songId: data.id,
        name: data.name,
        artist: data.artists[0].name,
        imageSrc: data.album.images[0].url,
        songUrl: data.external_urls.spotify
    }
}

function extractSpotifyId(url: string): string | null {
    const match = url.match(/spotify\.com\/(?:intl-[^\/]+\/)?track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

async function getSoundCloudAccessToken() {
    try {
        const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
        const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('SoundCloud credentials not configured');
        }

        const response = await fetch('https://api.soundcloud.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('SoundCloud token error:', error);
        return null;
    }
}

export async function createSoundCloudTrackData(url: string) {
    try {
        const accessToken = await getSoundCloudAccessToken();

        if (!accessToken) {
            throw new Error('Failed to obtain SoundCloud access token');
        }

        const apiUrl = `https://api.soundcloud.com/resolve?url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            if (res.status === 404) return null; // Track not found
            throw new Error(`SoundCloud API error: ${res.status}`);
        }

        const track = await res.json();

        // Only return info if it's a track
        if (track.kind !== 'track') return null;

        return {
            songId: track.id,
            name: track.title,
            artist: track.user.username,
            imageSrc: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : "",
            songUrl: track.permalink_url,
            platform: SongPlatform.SOUNDCLOUD
        };
    } catch (err) {
        console.error('SoundCloud resolve error:', err);
        return null;
    }
}