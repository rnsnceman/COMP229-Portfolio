import { Router } from 'express';
import { me, register, signIn, signOut } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/signup', register);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/me', protect, me);
export default router;
