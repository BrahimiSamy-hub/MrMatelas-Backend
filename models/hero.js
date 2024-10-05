const mongoose = require('mongoose')

const heroSchema = new mongoose.Schema(
  {
    arName: {
      type: String,
      required: true,
    },
    frName: {
      type: String,
      required: true,
    },
    engName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

const Hero = mongoose.model('Hero', heroSchema)

module.exports = Hero
