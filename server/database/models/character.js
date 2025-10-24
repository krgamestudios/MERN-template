const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['friend', 'partner', 'sibling'], required: true },
  happiness: { type: Number, default: 50, min: 0, max: 100 },
});

const achievementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    locked: { type: Boolean, default: true },
    progress: { type: Number, default: 0 },
    dateUnlocked: { type: Date },
});

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot: { type: Number, required: true, min: 1, max: 3 }, // 1, 2, or 3
  stats: {
    age: { type: Number, default: 0 },
    happiness: { type: Number, default: 50 },
    health: { type: Number, default: 100 },
    intelligence: { type: Number, default: 50 },
    money: { type: Number, default: 100 },
  },
  log: [{ type: String }],
  job: {
    title: { type: String, default: 'Unemployed' },
    salary: { type: Number, default: 0 },
  },
  salaryHistory: [{ age: Number, salary: Number }],
  relationships: [relationshipSchema],
  achievements: [achievementSchema],
  legacy: {
      playthroughs: { type: Number, default: 0 },
      unlockedAchievements: [{ type: String }],
  },
});

// Compound index to ensure a user can only have one character per slot
characterSchema.index({ userId: 1, slot: 1 }, { unique: true });

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
