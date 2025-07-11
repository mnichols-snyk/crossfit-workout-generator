import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, authorizeRoles } from '../src/middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

describe('authenticateToken middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = { headers: {} }; // Initialize headers to prevent undefined error
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();
  });

  test('should return 401 if no token is provided', () => {
    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 403 if token is invalid', () => {
    mockRequest.headers = { authorization: 'Bearer invalidtoken' };
    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should call next and attach user if token is valid', () => {
    const userPayload = { id: 1, email: 'test@example.com', role: 'user' };
    const token = jwt.sign(userPayload, JWT_SECRET);
    mockRequest.headers = { authorization: `Bearer ${token}` };

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalledTimes(1);
    // Use expect.objectContaining to ignore 'iat' and 'exp' properties added by JWT
    expect(mockRequest.user).toEqual(expect.objectContaining(userPayload));
  });
});

describe('authorizeRoles middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();
  });

  test('should call next if user has required role', () => {
    mockRequest.user = { id: 1, email: 'test@example.com', role: 'admin' };
    authorizeRoles('admin')(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 403 if user does not have required role', () => {
    mockRequest.user = { id: 1, email: 'test@example.com', role: 'user' };
    authorizeRoles('admin')(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient permissions' });
  });

  test('should return 403 if no user is attached to request', () => {
    authorizeRoles('admin')(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Forbidden: No user information' });
  });

  test('should call next if user has one of multiple required roles', () => {
    mockRequest.user = { id: 1, email: 'test@example.com', role: 'coach' };
    authorizeRoles('admin', 'coach')(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
