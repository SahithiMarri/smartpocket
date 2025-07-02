import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const goalSchema = new mongoose.Schema({
  userId: String,
  title: String,
  targetAmount: Number,
  savedAmount: Number
});

const Goal = mongoose.model('Goal', goalSchema);

router.get('/:userId', async (req, res) => {
  const goals = await Goal.find({ userId: req.params.userId });
  res.json(goals);
});

router.post('/', async (req, res) => {
  const { userId, goals } = req.body;
  await Goal.deleteMany({ userId }); // Replace existing
  await Goal.insertMany(goals.map(goal => ({ ...goal, userId })));
  res.status(201).json({ message: 'Goals updated' });
});

export default router;
