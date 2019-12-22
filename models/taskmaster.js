const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskmasterSchema = new Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Taskmaster', taskmasterSchema);