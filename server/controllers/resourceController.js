const fields = (Model, body) => Object.fromEntries(Object.keys(Model.schema.paths).filter(key => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key) && Object.hasOwn(body || {}, key)).map(key => [key, body[key]]));
import asyncHandler from '../middleware/asyncHandler.js';

export const list = (Model) => asyncHandler(async (_req, res) => {
  res.json(await Model.find().sort({ createdAt: -1 }));
});
export const getById = (Model) => asyncHandler(async (req, res) => {
  const record = await Model.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  res.json(record);
});
export const create = (Model) => asyncHandler(async (req, res) => {
  const record = await Model.create(fields(Model, req.body));
  res.status(201).json(record);
});
export const update = (Model) => asyncHandler(async (req, res) => {
  const record = await Model.findByIdAndUpdate(req.params.id, { $set: fields(Model, req.body) }, {
    new: true, runValidators: true, context: 'query',
  });
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  res.json(record);
});
export const removeById = (Model) => asyncHandler(async (req, res) => {
  const record = await Model.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  res.json({ message: 'Record deleted.' });
});
export const removeAll = (Model) => asyncHandler(async (_req, res) => {
  const result = await Model.deleteMany({});
  res.json({ message: 'Records deleted.', deletedCount: result.deletedCount });
});
