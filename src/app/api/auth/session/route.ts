import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllUsers } from '@/lib/user-database';

// Get current user session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('userSession');
    
    if (!userSession) {
      return NextResponse.json(
        { success: false, message: 'No active session' },
        { status: 401 }
      );
    }

    try {
      const sessionData = JSON.parse(userSession.value);
      
      // Verify user still exists in database
      const users = await getAllUsers();
      const currentUser = users.find(u => u.id === sessionData.id);
      
      if (!currentUser) {
        // User no longer exists, clear session
        const response = NextResponse.json(
          { success: false, message: 'User session invalid' },
          { status: 401 }
        );
        response.cookies.delete('userSession');
        return response;
      }

      return NextResponse.json({
        success: true,
        user: currentUser
      });
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: 'Invalid session data' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Set user session (called after login)
export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid user data' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Session created'
    });

    // Set HTTP-only cookie with user session
    response.cookies.set('userSession', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Clear user session (logout)
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Session cleared'
    });
    
    response.cookies.delete('userSession');
    return response;
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
