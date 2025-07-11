import dotenv from 'dotenv';
dotenv.config(); // Load environment variables as early as possible

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors'; // Import cors
import { AppDataSource } from './data-source';
import userRoutes from './routes/userRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import workoutRoutes from './routes/workoutRoutes';
import authRoutes from './routes/authRoutes';
import logger from './utils/logger'; // Import the logger

const initializeApp = () => {
  const app = express();
  app.use(helmet());
  const PORT = process.env.PORT || 3000;

  // Configure CORS
  const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:56675'], // Allow frontend origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
  };
  app.use(cors(corsOptions)); // Use CORS middleware

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Welcome to the CrossFit Workout Generator API!');
  });

  // Routes - these will need to be updated to use TypeORM repositories
  app.use('/users', userRoutes);
  app.use('/exercises', exerciseRoutes);
  app.use('/workouts', workoutRoutes);
  app.use('/auth', authRoutes);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).send('Something broke!');
  });

  return app;
}

// Only initialize AppDataSource and start the server if app.ts is run directly
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      logger.info("Data Source has been initialized!");
      const app = initializeApp();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      logger.error("Error during Data Source initialization:", err);
    });
}

export default initializeApp;
