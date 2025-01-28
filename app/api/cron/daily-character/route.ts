import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

async function selectRandomCharacter() {
    console.log('Database URL exists:', !!process.env.POSTGRES_DATABASE_URL);
    
    const today = new Date().toISOString().split('T')[0];
    console.log('Current date:', today);

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
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Starting cron job execution');
        
        const characterId = await selectRandomCharacter();
        return NextResponse.json({ 
            success: true, 
            characterId,
            debug: {
                envExists: !!process.env.POSTGRES_DATABASE_URL,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error: unknown) {
        console.error('Error in daily character cron:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to select daily character',
                debug: {
                    envExists: !!process.env.POSTGRES_DATABASE_URL,
                    errorMessage,
                    timestamp: new Date().toISOString()
                }
            },
            { status: 500 }
        );
    }
}