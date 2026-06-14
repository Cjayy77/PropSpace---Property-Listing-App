const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Apartment', 'House', 'Studio'],
    },
    imageUrls: { type: [String], default: [] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

propertySchema.index({ city: 1 });
propertySchema.index({ price: 1 });

module.exports = mongoose.model('Property', propertySchema);
