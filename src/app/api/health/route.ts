import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      ok: false,
      storage: 'not-configured',
      error: 'MONGODB_URI is missing'
    });
  }

  try {
    const { getDb } = await import('@/lib/mongodb');
    const db = await getDb();

    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      storage: 'mongodb'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);

    return NextResponse.json(
      {
        ok: false,
        storage: 'mongodb',
        error:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : String(error)
            : 'Database connection failed'
      },
      { status: 503 }
    );
  }
}