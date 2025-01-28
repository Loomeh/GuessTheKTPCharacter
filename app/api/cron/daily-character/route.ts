import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

// Remove the edge runtime directive
// export const runtime = 'edge';

async function selectRandomCharacter() {
    try {
        const existingResult = await sql`
            SELECT character_id 
            FROM daily_character 
            WHERE date = CURRENT_DATE
        `;

        if (existingResult.length > 0) {
            return existingResult[0].character_id;
        }

        // Insert using INSERT...SELECT syntax
        const newResult = await sql`
            INSERT INTO daily_character (character_id, date)
            SELECT id, CURRENT_DATE
            FROM characters
            ORDER BY random()
            LIMIT 1
            RETURNING character_id
        `;

        return newResult[0].character_id;

    } catch (e) {
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