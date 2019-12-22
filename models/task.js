const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: { type: String, required: true },
  taskmaster: { type: mongoose.Types.ObjectId, required: true, ref: 'Taskmaster' },
  type: { type: mongoose.Types.ObjectId, required: true, ref: 'Type' },
  deadline: { type: Date, required: true }
});

module.exports = mongoose.model('Task', taskSchema);