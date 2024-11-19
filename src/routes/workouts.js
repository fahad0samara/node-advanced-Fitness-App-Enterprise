const express = require('express');
const router = express.Router();

// Workout data (in-memory storage for demonstration)
let workouts = [];

// Get all workouts
router.get('/', (req, res) => {
  res.json(workouts);
});

// Add new workout
router.post('/', (req, res) => {
  const workout = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  workouts.push(workout);
  res.status(201).json(workout);
});

// Get workout by ID
router.get('/:id', (req, res) => {
  const workout = workouts.find(w => w.id === req.params.id);
  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  res.json(workout);
});

// Update workout
router.put('/:id', (req, res) => {
  const index = workouts.findIndex(w => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  workouts[index] = { ...workouts[index], ...req.body };
  res.json(workouts[index]);
});

// Delete workout
router.delete('/:id', (req, res) => {
  workouts = workouts.filter(w => w.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;