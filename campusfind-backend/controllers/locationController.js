const Location = require('../models/Location');

const getLocationByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const location = await Location.findOne({ code }).lean();
    if (!location) {
      return res.status(404).json({ message: `Location with code '${code}' not found` });
    }
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLocationByCode };

