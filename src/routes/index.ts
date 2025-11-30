import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userRoutes } from '../features/user/routes/user.routes';
import { noteRoutes } from '../features/note/routes/note.route';


const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Server is healthy',
  });
});

//Note routes
router.use('/notes', noteRoutes)

// User routes
router.use('/users', userRoutes);

export const routes = router;