import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Change for production

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      (req as any).user = user;
      next();
    });
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
