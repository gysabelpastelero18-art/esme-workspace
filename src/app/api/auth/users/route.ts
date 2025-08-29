import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../../lib/user-database';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
