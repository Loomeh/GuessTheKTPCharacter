import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

async function selectRandomCharacter() {
    try {
        // Check existing character first
        const existingResult = await sql`
            SELECT character_id 
            FROM daily_character 
            WHERE date = CURRENT_DATE
        `;

        if (existingResult.length > 0) {
            return existingResult[0].character_id;
        }

        // 1. First get a random character ID
        const randomChar = await sql`
            SELECT id 
            FROM characters 
            ORDER BY random() 
            LIMIT 1
        `;

        // 2. Explicitly insert with typed parameter
        const newResult = await sql`
            INSERT INTO daily_character (character_id, date)
            VALUES (${randomChar[0].id}::text, CURRENT_DATE)
            RETURNING character_id
        `;

        return newResult[0].character_id;

    } catch (e) {
        const error = e as Error;
        console.error('Database error:', error);
        throw new Error('Failed to process daily character');
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