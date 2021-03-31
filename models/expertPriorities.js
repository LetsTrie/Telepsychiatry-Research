const mongoose = require('mongoose')

const expertPrioritySchema = new mongoose.Schema({
  expert_id: String,
  priority: Number
})

exports.expertPriority = mongoose.model('expert-priority', expertPrioritySchema)