const Order = require('../models/order')
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_API
const chatIds = ['5096403407']
const createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body }
    const newOrder = new Order(orderData)
    const createdOrder = await newOrder.save()

    // Assuming that the `Order` model is correctly set up to reference `Product`
    const order = await Order.findById(createdOrder._id).populate({
      path: 'orderItems.product',
    })

    let message = `New Order Created:\n`
    message += `Order ID: ${order.reference}\n`
    message += `----------------------------\n`
    message += `Items:\n`
    order.orderItems.forEach((item) => {
      message += `${item.product.engName}  -  Quantity: ${
        item.quantity
      }, Price: ${item.price * item.quantity}DA\n`
      message += `Hex: ${item.hex}\n`
      if (item.longeur) {
        message += `Longeur: ${item.longeur} cm\n`
      }
      if (item.largeur) {
        message += `Largeur: ${item.largeur} cm\n`
      }
      if (item.epesseur) {
        message += `Épaisseur: ${item.epesseur} cm\n`
      }
      message += `----------------------------\n`
    })

    message += `Total: ${order.total} DA\n`
    message += `----------------------------\n`
    message += `Client Info:\n`
    message += `Name: ${order.fullName}\n`
    message += `Address: ${order.address}\n`
    message += `Phone1: ${order.phoneNumber1}\n`
    message += `Shipping type: ${order.shippingType}\n`
    message += `Wilaya: ${order.wilaya}\n`
    message += `Commune: ${order.commune}\n`

    if (order.note) {
      message += `Note: ${order.note}\n`
    }

    // Sending the message via Telegram
    const bot = new TelegramBot(token, { polling: false })
    chatIds.forEach((chatId) => {
      bot
        .sendMessage(chatId, message)
        .then((response) => {})
        .catch((err) => {
          console.error(
            `Failed to send message to ${chatId} via Telegram:`,
            err
          )
        })
    })
    res.status(201).json(order)
  } catch (error) {
    console.error('Error creating Order:', error)
    res.status(500).json({ error: 'Error creating Order' })
  }
}

const getOrders = async (req, res) => {
  try {
    //set 3 seconds timout to simulate slow network
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status
    const filter = req.query.filter
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [{ path: 'orderItems.product', select: 'engName' }],
    }
    const query = {}
    if (status) {
      query.status = status
    }
    if (filter) {
      const regex = new RegExp(filter, 'i')
      query.$or = [
        { reference: { $regex: regex } },
        { fullName: { $regex: regex } },
        { wilaya: { $regex: regex } },
        { phoneNumber1: { $regex: regex } },
        { phoneNumber2: { $regex: regex } },
      ]
    }

    const orders = await Order.paginate(query, options)
    res.status(200).json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error retrieving Orders.')
  }
}

const updateOrder = async (req, res) => {
  //set 3 seconds timout to simulate slow network
  const orderId = req.params.id
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    }).populate('orderItems.product')

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.status(200).json(updatedOrder)
  } catch (error) {
    res.status(500).json({ error: 'Error updating Order' })
  }
}

const sendTelegramMessage = async (req, res) => {
  try {
    const bot = new TelegramBot(token, { polling: false })
    const { message } = req.body
    const chatId = '' // Your Telegram chat ID

    bot
      .sendMessage(chatId, message)
      .then((response) => {
        console.log('Message sent', response)
        res.status(200).send('Message sent successfully')
      })
      .catch((err) => {
        console.error('Failed to send message', err)
        res.status(500).send('Failed to send message')
      })
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' })
  }
}

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  sendTelegramMessage,
}
