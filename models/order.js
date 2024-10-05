const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const counterSchema = new mongoose.Schema({
  date: String,
  counter: {
    type: Number,
    default: 1,
  },
})

const Counter = mongoose.model('Counter', counterSchema)

const orderSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'canceled',
        'shipped',
        'delivered',
        'returned',
      ],
      default: 'pending',
    },
    fullName: {
      type: String,
    },
    address: {
      type: String,
    },
    wilaya: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    total: {
      type: Number,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
)

orderSchema.pre('save', async function (next) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '') // format yyyymmdd
  const result = await Counter.findOneAndUpdate(
    { date: today },
    { $inc: { counter: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  // Update the reference field in the order document
  this.reference = `#${today}${result.counter}`
  next()
})
orderSchema.plugin(mongoosePaginate)
const Order = mongoose.model('Order', orderSchema)

module.exports = Order
