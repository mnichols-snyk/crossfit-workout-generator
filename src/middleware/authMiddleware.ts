import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../types/express'; // Import JwtPayload
import jwt from 'jsonwebtoken';
import logger from '../utils/logger'; // Import the logger

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.warn('Authentication failed: No token provided.');
    return res.status(401).json({ message: 'Unauthorized' }); // No token provided
  }

  
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined. Please set it to a strong, random string.');
}

jwt.verify(token, JWT_SECRET!, (err, user) => {
    if (err) {
      logger.error(`Authentication failed: Invalid token - ${err.message}`);
      return res.status(401).json({ message: 'Unauthorized' }); // Invalid token
    }
    req.user = user as JwtPayload;
    logger.info(`User ${req.user?.email} authenticated successfully.`);
    next();
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Authorization failed: No user attached to request.');
      return res.status(403).json({ message: 'Forbidden: No user information' });
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(`Authorization failed for user ${req.user?.email}: Insufficient permissions. Required roles: ${roles.join(', ')}, User role: ${req.user?.role}`);
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    logger.info(`User ${req.user?.email} authorized with role ${req.user?.role}.`);
    next();
  };
};
