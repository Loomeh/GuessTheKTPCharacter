import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export const runtime = 'edge';

async function selectRandomCharacter() {
    const today = new Date().toISOString().split('T')[0];

    try {
        // First check if we already have a character for today
        const existing = await sql`
            SELECT character_id 
            FROM daily_character 
            WHERE date = ${today}
        `;

        if (existing.length > 0) {
            return existing[0].character_id;
        }

        // If no character exists for today, select a random one
        const [character] = await sql`
            WITH RandomChar AS (
                SELECT id as character_id
                FROM characters
                ORDER BY random()
                LIMIT 1
            )
            INSERT INTO daily_character (character_id, date)
            SELECT character_id, ${today}::date
            FROM RandomChar
            RETURNING character_id
        `;

        return character.character_id;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export async function GET() {
    try {
        const characterId = await selectRandomCharacter();
        return NextResponse.json({ 
            success: true, 
            characterId,
            timestamp: new Date().toISOString()
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { 
                success: false, 
                error: errorMessage,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}