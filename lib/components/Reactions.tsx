'use client'

import { useState } from 'react'

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
    const [isLoading, setIsLoading] = useState(false)

    // Reactions zu Array
    let reactions: Reaction[] = [];
    if (reactionsData) reactions = JSON.parse(reactionsData);

    // Find user's existing reaction
    const userReaction = reactions.find(r => r.users.includes(currentUserId || ''));

    const handleReactionSelect = async (emoji: string) => {
        if (!entryId || !currentUserId) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/reactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emoji, entryId })
            });

            if (response.ok) {
                window.location.reload()
            } else {
                console.error('Reaction failed:', response.statusText)
            }
        } catch (error) {
            console.error('Reaction error:', error)
        }
        setIsLoading(false)
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
                    disabled={isLoading}
                    className="hover:scale-110 transition-transform disabled:opacity-50"
                >
                    {emoji}
                </button>
            ))}
        </div>
    )
}