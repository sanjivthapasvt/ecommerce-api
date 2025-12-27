import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userRoutes } from '../features/user/routes/user.routes';


const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Server is healthy',
  });
});


// User routes
router.use('/users', userRoutes);

export const routes = router;