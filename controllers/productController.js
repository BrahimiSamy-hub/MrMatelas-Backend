const Product = require('../models/product') // Adjust the path as necessary
const Category = require('../models/category') // Adjust the path as necessary

const createProduct = async (req, res) => {
  try {
    console.log(req.body)
    const newProduct = new Product({ ...req.body })
    await newProduct.save()
    res.status(200).json(newProduct)
  } catch (error) {
    console.error('Failed to create product:', error)
    res.status(500).json({ error: 'Error creating product', details: error })
  }
}

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: 'category images',
    }
    const query = {
      isDrafted: false,
    }
    if (req.query.category) {
      query.category = req.query.category
    }

    const products = await Product.paginate(query, options)
    res.status(200).json(products)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error retrieving Products.')
  }
}

const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body }
    const productId = req.params.id

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
      }
    )
      .populate('category')
      .populate('images')

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating Product',
    })
    console.error(error)
  }
}
const getOneProduct = async (req, res) => {
  const productId = req.params.id
  try {
    const product = await Product.findById(productId)
      .populate('category')
      .populate('images')

    if (product.isSale === true && product.saleEnds < new Date()) {
      await Product.findByIdAndUpdate(product._id, {
        isSale: false,
        saleEnds: null,
        salePrice: 0,
      })
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Error getting Product' })
  }
}

const getRandomProducts = async (req, res) => {
  try {
    const randomNumber = Number(req.query.number)
    if (!randomNumber) {
      return res.status(400).json({ error: 'Please provide a random number' })
    }

    const baseUrl = process.env.BASE_URL

    const products = await Product.aggregate([
      { $match: { isDrafted: false } }, // Add this line to filter out drafted products
      { $sample: { size: randomNumber } },
      {
        $lookup: {
          from: 'categories', // This should match the name of the collection for categories
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'files', // This should match the name of the collection for files
          localField: 'images',
          foreignField: '_id',
          as: 'images',
        },
      },
      { $unwind: { path: '$images', preserveNullAndEmptyArrays: true } }, // Unwind the images array to return as an object
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }, // Unwind the category array to return as an object
      {
        $addFields: {
          'images.urls': {
            $map: {
              input: '$images.urls',
              as: 'url',
              in: { $concat: [baseUrl, '$$url'] },
            },
          },
        },
      },
    ])

    products.forEach(async (product) => {
      if (product.saleEnds < new Date()) {
        await Product.findByIdAndUpdate(product._id, {
          isSale: false,
          saleEnds: null,
          salePrice: 0,
        })
      }
    })

    res.status(200).json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

const getProductsName = async (req, res) => {
  try {
    const products = await Product.find({ isDrafted: false })
      .select('engName')
      .sort({ engName: 1 })
    res.status(200).json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllProducts,
  updateProduct,
  getOneProduct,
  createProduct,
  getRandomProducts,
  getProductsName,
}
