
import { NextResponse, NextRequest } from 'next/server';
import { deleteUser } from '../../../../../lib/user-database';

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const userId = Number(context.params.id);
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
  }
  try {
    const result = await deleteUser(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
