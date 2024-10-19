const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productSchema = new mongoose.Schema(
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
    },
    arDescription: {
      type: String,
    },
    frDescription: {
      type: String,
    },
    engDescription: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    isDrafted: {
      type: Boolean,
      default: false,
    },
    sizes: [
      {
        longeur: {
          type: Number,
        },
        largeur: {
          type: Number,
        },
        epesseur: {
          type: Number,
        },
        price: {
          type: Number,
        },
        inStock: {
          type: Boolean,
          default: true,
        },
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enum: ['bébé', 'adulte'],
    },
    spots: {
      type: Number,
      enum: [1, 2],
    },
    spotType: {
      type: String,
      enum: ['ouvert', 'roulé'],
    },
  },
  { timestamps: true, versionKey: false }
)

productSchema.plugin(mongoosePaginate)
const Product = mongoose.model('Product', productSchema)

module.exports = Product
