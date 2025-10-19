import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const mentors = await db.user.findMany({
      where: {
        role: 'HOST', // Assuming mentors are users with the HOST role
      },
      select: {
        id: true,
        name: true,
        image: true,
        skills: true,
        bio: true,
      },
    });
    return NextResponse.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}