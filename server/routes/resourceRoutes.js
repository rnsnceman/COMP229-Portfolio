import { Router } from 'express';
import { create, getById, list, removeAll, removeById, update } from '../controllers/resourceController.js';

export default function resourceRoutes(Model, { protect, publicCreate = false } = {}) {
  const router = Router();
  if (protect) router.use(protect);
  else if (publicCreate) router.post('/', create(Model));
  router.get('/', list(Model));
  router.get('/:id', getById(Model));
  if (!(publicCreate && !protect)) router.post('/', create(Model));
  router.put('/:id', update(Model));
  router.delete('/:id', removeById(Model));
  router.delete('/', removeAll(Model));
  return router;
}
