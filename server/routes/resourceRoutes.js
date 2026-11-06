import { Router } from 'express';
import { create, getById, list, removeAll, removeById, update } from '../controllers/resourceController.js';
import { protect, requireAdmin } from '../middleware/auth.js';
export default function resourceRoutes(Model, { contact = false } = {}) {
  const router = Router();
  // The public contact form is the intentional exception to admin-only creation.
  if (contact) router.post('/', create(Model));
  router.get('/', ...(contact ? [protect] : []), list(Model));
  router.get('/:id', ...(contact ? [protect] : []), getById(Model));
  router.use(protect, requireAdmin);
  if (!contact) router.post('/', create(Model));
  router.put('/:id', update(Model));
  router.delete('/:id', removeById(Model));
  router.delete('/', removeAll(Model));
  return router;
}
