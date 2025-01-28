import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export const runtime = 'edge';

async function selectRandomCharacter() {
    try {
        // Use PostgreSQL's CURRENT_DATE directly
        const result = await sql`
            INSERT INTO daily_character (character_id, date)
            SELECT 
                c.id,
                CURRENT_DATE
            FROM characters c
            WHERE NOT EXISTS (
                SELECT 1 
                FROM daily_character dc 
                WHERE dc.date = CURRENT_DATE
            )
            ORDER BY random()
            LIMIT 1
            RETURNING character_id;
        `;

        if (result.length > 0) {
            return result[0].character_id;
        }

        // If no insertion happened, get today's character
        const existing = await sql`
            SELECT character_id 
            FROM daily_character 
            WHERE date = CURRENT_DATE
        `;

        return existing[0].character_id;

    } catch (e) {
        // Properly type the error
        const error = e as Error;
        console.error('Database error:', {
            message: error.message,
            name: error.name,
            timestamp: new Date().toISOString()
        });
        throw new Error('Failed to select or retrieve daily character');
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
    } catch (e) {
        const error = e as Error;
        
        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}