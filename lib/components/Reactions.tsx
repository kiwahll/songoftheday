'use client'

import { useEffect, useState } from 'react'

interface Reaction {
    emoji: string
    users: string[]
}

interface ReactionsProps {
    entryId?: string
    currentUserId?: string
    reactionsData?: string,
    isOwnCard: boolean
}

const AVAILABLE_EMOJIS = ['❤️', '😂', '🤝', '🔥']

export default function Reactions({ entryId, currentUserId, reactionsData, isOwnCard }: ReactionsProps) {
    const [reactions, setReactions] = useState<Reaction[]>([]);

    // Reactions zu Array
    useEffect(() => {
        if (reactionsData) setReactions(JSON.parse(reactionsData));
    }, []);
    console.log(reactionsData);

    // Find user's existing reaction
    const userReaction = reactions.find(r => r.users.includes(currentUserId || ''));

    const handleReactionSelect = async (emoji: string) => {
        if (!entryId || !currentUserId) return;
        const prevReactions: Reaction[] = [...reactions];

        try {
            const response = await fetch('/api/reactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emoji, entryId })
            });

            if (response.ok) {
                if (response.ok) {
                    setReactions(prevReactions => {
                        const existing = prevReactions.find(r => r.emoji === emoji);
                        if (existing) {
                            return prevReactions.map(r =>
                                r.emoji === emoji
                                    ? { ...r, users: [...r.users, currentUserId] }
                                    : r
                            );
                        } else {
                            return [...prevReactions, { emoji, users: [currentUserId] }];
                        }
                    });
                }
            } else {
                setReactions(prevReactions);
                console.error('Reaction failed:', response.statusText)
            }
        } catch (error) {
            setReactions(prevReactions);
            console.error('Reaction error:', error)
        }
    }

    // If user has already reacted, show only display
    if (userReaction || isOwnCard) {
        return (
            <div className="flex gap-3">
                {AVAILABLE_EMOJIS.map((emoji) => {
                    const hit = reactions.find(r => r.emoji === emoji);
                    if (hit) {
                        const count = hit.users.length;
                        return (
                            <p key={hit.emoji}>
                                {count}{hit.emoji}
                            </p>
                        );
                    } else {
                        return (
                            <p key={emoji} className='opacity-50'>
                                {emoji}
                            </p>
                        );
                    }
                })}
            </div>
        )
    }

    // Show selector for user to choose reaction
    return (
        <div className="flex gap-3">
            {AVAILABLE_EMOJIS.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => handleReactionSelect(emoji)}
                    className="hover:scale-110 transition-transform"
                >
                    {emoji}
                </button>
            ))}
        </div>
    )
}