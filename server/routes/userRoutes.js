import { Router } from 'express';
import { deleteAllUsers, deleteUser, getUser, listUsers, register, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/', register);
router.use(protect);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.delete('/', deleteAllUsers);
export default router;
