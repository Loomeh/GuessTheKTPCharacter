import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

// Mark as edge function
export const runtime = 'edge';

async function selectRandomCharacter() {
    const today = new Date().toISOString().split('T')[0];

    try {
        const [character] = await sql`
            WITH RandomCharacter AS (
                SELECT *,
                ROW_NUMBER() OVER (
                    ORDER BY MD5(CONCAT(${today}, id))::uuid
                ) as rn
                FROM characters
            )
            SELECT id FROM RandomCharacter WHERE rn = 1
        `;
        return character.id;
    } catch (error) {
        console.error('SQL Error:', error);
        throw error;
    }
}

export async function GET() {
    try {
        const characterId = await selectRandomCharacter();
        return NextResponse.json({ success: true, characterId });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}