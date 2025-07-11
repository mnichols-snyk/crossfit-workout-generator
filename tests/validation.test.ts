import { Request, Response, NextFunction } from 'express';


// Mock the entire express-validator module
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  body: jest.fn(() => ({
    trim: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    isObject: jest.fn().mockReturnThis(),
    custom: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    isArray: jest.fn().mockReturnThis(),
    isISO8601: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(), // Added back for body
  })),
  param: jest.fn(() => ({
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
  })),
}));

// Import the mocked validationResult after the mock definition
const { validationResult } = require('express-validator');


import { validateUser, validateUpdateUser, validateExercise, validateUpdateExercise, validateWorkout, validateUpdateWorkout, validateLogWorkoutResult } from '../src/middleware/validationMiddleware';

describe('validateUser middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid user data', async () => {
    mockRequest.body = {
      email: 'test@example.com',
      password_hash: 'password123',
    };

    for (const validator of validateUser) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if email is invalid', async () => {
    mockRequest.body = {
      email: 'invalid-email',
      password_hash: 'password123',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Invalid email format', param: 'email' }]),
    });

    for (const validator of validateUser) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Invalid email format', param: 'email' }],
    });
  });

  test('should return 400 if password_hash is too short', async () => {
    mockRequest.body = {
      email: 'test@example.com',
      password_hash: 'short',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Password must be at least 6 characters long', param: 'password_hash' }]),
    });

    for (const validator of validateUser) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Password must be at least 6 characters long', param: 'password_hash' }],
    });
  });
});

describe('validateUpdateUser middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid partial user data', async () => {
    mockRequest.body = {
    };

    for (const validator of validateUpdateUser) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if updated email is invalid', async () => {
    mockRequest.body = {
      email: 'invalid-email-update',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Invalid email format', param: 'email' }]),
    });

    for (const validator of validateUpdateUser) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Invalid email format', param: 'email' }],
    });
  });

  test('should call next if no fields are provided (optional)', async () => {
    mockRequest.body = {};

    for (const validator of validateUpdateUser) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});

describe('validateExercise middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid exercise data', async () => {
    mockRequest.body = {
      name: 'Push-ups',
      description: 'Bodyweight exercise',
      type: 'Strength',
      difficulty: 'Beginner',
    };

    for (const validator of validateExercise) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if exercise name is missing', async () => {
    mockRequest.body = {
      description: 'Bodyweight exercise',
      type: 'Strength',
      difficulty: 'Beginner',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Exercise name is required', param: 'name' }]),
    });

    for (const validator of validateExercise) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Exercise name is required', param: 'name' }],
    });
  });

  test('should return 400 if exercise type is missing', async () => {
    mockRequest.body = {
      name: 'Push-ups',
      description: 'Bodyweight exercise',
      difficulty: 'Beginner',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Exercise type is required', param: 'type' }]),
    });

    for (const validator of validateExercise) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Exercise type is required', param: 'type' }],
    });
  });
});

describe('validateUpdateExercise middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid partial exercise data', async () => {
    mockRequest.body = {
      name: 'Updated Push-ups',
    };

    for (const validator of validateUpdateExercise) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if updated exercise name is empty', async () => {
    mockRequest.body = {
      name: '',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Exercise name cannot be empty', param: 'name' }]),
    });

    for (const validator of validateUpdateExercise) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Exercise name cannot be empty', param: 'name' }],
    });
  });

  test('should call next if no fields are provided (optional)', async () => {
    mockRequest.body = {};

    for (const validator of validateUpdateExercise) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});

describe('validateWorkout middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid workout data', async () => {
    mockRequest.body = {
      user_id: 1,
      name: 'Workout A',
      description: 'Full body workout',
      date: '2023-01-01',
      exercises: [
        { exercise_id: 1, sets: 3, reps: 10 },
        { exercise_id: 2, duration: 60 },
      ],
    };

    for (const validator of validateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if user_id is missing', async () => {
    mockRequest.body = {
      name: 'Workout A',
      description: 'Full body workout',
      date: '2023-01-01',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'User ID is required', param: 'user_id' }]),
    });

    for (const validator of validateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'User ID is required', param: 'user_id' }],
    });
  });

  test('should return 400 if date is invalid', async () => {
    mockRequest.body = {
      user_id: 1,
      name: 'Workout A',
      description: 'Full body workout',
      date: 'invalid-date',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Date must be a valid ISO 8601 date string (YYYY-MM-DD)', param: 'date' }]),
    });

    for (const validator of validateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Date must be a valid ISO 8601 date string (YYYY-MM-DD)', param: 'date' }],
    });
  });

  test('should return 400 if exercises is not an array', async () => {
    mockRequest.body = {
      user_id: 1,
      name: 'Workout A',
      description: 'Full body workout',
      date: '2023-01-01',
      exercises: 'not an array',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Exercises must be an array', param: 'exercises' }]),
    });

    for (const validator of validateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Exercises must be an array', param: 'exercises' }],
    });
  });

  test('should return 400 if exercise in array has invalid exercise_id', async () => {
    mockRequest.body = {
      user_id: 1,
      name: 'Workout A',
      description: 'Full body workout',
      date: '2023-01-01',
      exercises: [
        { exercise_id: 'abc', sets: 3, reps: 10 },
      ],
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Each exercise in the array must have an integer exercise_id', param: 'exercises' }]),
    });

    for (const validator of validateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Each exercise in the array must have an integer exercise_id', param: 'exercises' }],
    });
  });
});

describe('validateUpdateWorkout middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid partial workout data', async () => {
    mockRequest.body = {
      name: 'Updated Workout B',
    };

    for (const validator of validateUpdateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if updated date is invalid', async () => {
    mockRequest.body = {
      date: 'invalid-updated-date',
    };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Date must be a valid ISO 8601 date string (YYYY-MM-DD)', param: 'date' }]),
    });

    for (const validator of validateUpdateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Date must be a valid ISO 8601 date string (YYYY-MM-DD)', param: 'date' }],
    });
  });

  test('should call next if no fields are provided (optional)', async () => {
    mockRequest.body = {};

    for (const validator of validateUpdateWorkout) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});

describe('validateLogWorkoutResult middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    nextFunction = jest.fn();

    // Reset mocks before each test
    // Reset mocks before each test
    (validationResult as jest.Mock).mockClear();
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  test('should call next if validation passes with valid result_data', async () => {
    mockRequest.params = { workout_id: '1' };
    mockRequest.body = { result_data: { reps: 10, weight: 100 } };

    // Manually run the validation chain
    for (const validator of validateLogWorkoutResult) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return 400 if workout_id is not an integer', async () => {
    mockRequest.params = { workout_id: 'abc' };
    mockRequest.body = { result_data: { reps: 10 } };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Workout ID must be an integer', param: 'workout_id' }]),
    });

    // Manually run the validation chain
    for (const validator of validateLogWorkoutResult) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Workout ID must be an integer', param: 'workout_id' }],
    });
  });

  test('should return 400 if result_data is an empty object', async () => {
    mockRequest.params = { workout_id: '1' };
    mockRequest.body = { result_data: {} };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Result data cannot be an empty object', param: 'result_data' }]),
    });

    // Manually run the validation chain
    for (const validator of validateLogWorkoutResult) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Result data cannot be an empty object', param: 'result_data' }],
    });
  });

  test('should return 400 if result_data is not an object', async () => {
    mockRequest.params = { workout_id: '1' };
    mockRequest.body = { result_data: 'not an object' };

    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => false),
      array: jest.fn(() => [{ msg: 'Result data must be an object', param: 'result_data' }]),
    });

    // Manually run the validation chain
    for (const validator of validateLogWorkoutResult) {
      if (typeof validator === 'function') {
        await validator(mockRequest as Request, mockResponse as Response, nextFunction);
      }
    }

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Result data must be an object', param: 'result_data' }],
    });
  });
});
