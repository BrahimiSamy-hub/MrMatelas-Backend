const Hero = require('../models/hero')

const createHero = async (req, res) => {
  try {
    const newHero = new Hero({
      ...req.body,
    })

    const createdHero = await newHero.save()

    res.status(200).json(createdHero)
  } catch (error) {
    res.status(500).json({ error: 'Error creating Hero' })
  }
}
const updateHero = async (req, res) => {
  const heroId = req.params.id
  try {
    const updatedCategory = await Hero.findByIdAndUpdate(heroId, req.body, {
      new: true,
    })

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Hero not found' })
    }

    res.status(200).json(updatedCategory)
  } catch (error) {
    res.status(500).json({ error: 'Error updating Hero' })
  }
}
const getHeroes = async (req, res) => {
  try {
    const categories = await Hero.find({})
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Heroes' })
  }
}

module.exports = {
  createHero,
  updateHero,
  getHeroes,
}
