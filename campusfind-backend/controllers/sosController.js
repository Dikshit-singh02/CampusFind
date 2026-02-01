const SOS = require('../models/SOS');

const getSOS = async (req, res) => {
  try {
    const sos = await SOS.find();
    res.json(sos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSOS = async (req, res) => {
  const { user, location, message } = req.body;
  try {
    const sos = new SOS({ user, location, message });
    await sos.save();
    res.status(201).json(sos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getSOS, createSOS };
