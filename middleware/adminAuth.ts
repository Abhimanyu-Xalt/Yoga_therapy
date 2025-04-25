import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

export const verifyAdminToken = async () => {
  try {
    const headersList = headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) {
      return {
        success: false,
        error: 'No token provided'
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return {
        success: false,
        error: 'Unauthorized: Admin access required'
      };
    }

    return {
      success: true,
      decoded
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid token'
    };
  }
}; 