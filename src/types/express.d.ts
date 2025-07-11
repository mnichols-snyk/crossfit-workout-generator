import { Request } from 'express';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

declare module 'express' {
  interface Request {
    file?: Express.Multer.File;
    user?: JwtPayload; // Add the user property with JwtPayload type
  }
}
