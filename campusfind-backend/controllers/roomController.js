const Room = require('../models/Room');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { roomNumber, department, location } = req.body;
    const room = new Room({
      roomNumber,
      department,
      location,
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRooms, createRoom };
