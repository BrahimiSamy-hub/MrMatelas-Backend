const Category = require('../models/category')
const Product = require('../models/product')

const createCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
      image: req.file ? `uploads/${req.file.filename}` : undefined,
    })

    const createdCategory = await newCategory.save()

    res.status(200).json(createdCategory)
  } catch (error) {
    res.status(500).json({ error: 'Error creating Category' })
  }
}

const updateCategory = async (req, res) => {
  const categoryId = req.params.id
  try {
    const updatedData = {
      ...req.body,
    }

    if (req.file) {
      updatedData.image = `uploads/${req.file.filename}`
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true }
    )

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.status(200).json(updatedCategory)
  } catch (error) {
    res.status(500).json({ error: 'Error updating Category' })
  }
}

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId)

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' })
    }

    await Product.deleteMany({ category: categoryId })

    res.status(200).json(deletedCategory)
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Category' })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Categories' })
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
}
