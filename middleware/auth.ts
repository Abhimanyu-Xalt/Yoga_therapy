import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/utils/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export async function authMiddleware(
  request: AuthenticatedRequest,
  allowedRoles: string[] = []
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Add user info to request
    request.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    return null; // Continue to route handler
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 401 }
    );
  }
} 