/**
 * Libraries
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Schemas and Models
 */
const friendSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
  },
);
const Friend = mongoose.model('Friend', friendSchema);

module.exports = { Friend };
