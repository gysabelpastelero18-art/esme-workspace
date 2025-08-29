import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/user-database';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateUser(username, password);
    
    if (result.success && result.user) {
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: result.user
      });

      // Set HTTP-only cookie with user session
      response.cookies.set('userSession', JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
