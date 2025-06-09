const mongoose = require('mongoose');
const Demander = require('../models/Demander');  // Add this import

const createDemander = async (req, res) => {
  try {
    const demander = new Demander({
      ...req.body,
      businessType: req.body.businessType
    });
    await demander.save();
    res.status(201).send(demander);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getDemanders = async (req, res) => {
  try {
    const demanders = await Demander.find();
    res.send(demanders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getDemanderById = async (req, res) => {
  try {
    const demander = await Demander.findById(req.params.id);
    if (!demander) {
      return res.status(404).send({ error: 'Demander not found' });
    }
    res.send(demander);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateDemander = async (req, res) => {
  try {
    const demander = await Demander.findByIdAndUpdate(req.params.id, {
      ...req.body,
      businessType: req.body.businessType
    }, { new: true });
    if (!demander) {
      return res.status(404).send({ error: 'Demander not found' });
    }
    res.send(demander);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteDemander = async (req, res) => {
  try {
    const demander = await Demander.findByIdAndDelete(req.params.id);
    if (!demander) {
      return res.status(404).send({ error: 'Demander not found' });
    }
    res.send({ message: 'Demander deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getDemandersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const demanders = await Demander.find({ user_id: userId });
    
    if (!demanders.length) {
      return res.status(404).json({ 
        error: 'No demanders found for this user',
        user_id: userId
      });
    }

    res.json(demanders);
  } catch (error) {
    console.error('Error fetching demanders:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

module.exports = {
  createDemander,
  getDemanders,
  getDemanderById,
  updateDemander,
  deleteDemander,
  getDemandersByUserId
};