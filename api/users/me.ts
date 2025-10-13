import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../_lib/storage.js';

function readCookie(req: VercelRequest, name: string): string | null {
  const raw = req.headers.cookie || '';
  const parts = raw.split(';').map(v => v.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = readCookie(req, 'auth_token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server misconfigured' });

    const payload = jwt.verify(token, secret) as { userId?: string };
    if (!payload?.userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await storage.getUser(payload.userId);
    if (!user) return res.status(404).json({ error: 'Not found' });

    const { password, ...userData } = user as any;

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ user: userData });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
