import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ensure dotenv is loaded before reading environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not set.');
  if (process.env.NODE_ENV === 'production') process.exit(1);
} else {
  console.log('[Auth Middleware] JWT_SECRET loaded, length:', JWT_SECRET.length, 'first 10 chars:', JWT_SECRET.substring(0, 10));
}

// Ensure JWT_SECRET is defined for TypeScript
const jwtSecret: string = JWT_SECRET || 'fallback-for-dev-only';


export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Parse cookies from Cookie header (for Vercel serverless compatibility)
 */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=').trim();
    if (name && value) {
      cookies[name.trim()] = decodeURIComponent(value);
    }
    return cookies;
  }, {} as Record<string, string>);
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token: string | undefined;

    // Try to get token from Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // If no Authorization header, try to get token from cookie
    // Handle both Express cookie-parser (req.cookies) and manual parsing (for Vercel)
    if (!token) {
      if (req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token;
        console.log('[Auth] Token from req.cookies');
      } else {
        // Manually parse cookies for Vercel serverless functions
        const cookies = parseCookies(req.headers.cookie);
        token = cookies.auth_token;
        if (token) {
          console.log('[Auth] Token from manual cookie parsing');
        }
      }
    }
    
    if (!token) {
      console.log('[Auth] No token found. Cookie header:', req.headers.cookie);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    console.log('[Auth] Token verified successfully for user:', decoded.userId);
    
    if (!decoded.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token payload'
      });
    }

    // Attach userId to request
    req.userId = decoded.userId;

    // Call next middleware
    next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error instanceof jwt.JsonWebTokenError ? error.message : error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Helper function to generate JWT token for a user
 * This would typically be called after successful login
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
}