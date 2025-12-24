const ChargingStationModel = require('../models/chargingStationModel');

exports.getAll = async (req, res, next) => {
  try {
    const stations = await ChargingStationModel.getAll(req.query);
    res.json({ success: true, data: stations, count: stations.length });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const station = await ChargingStationModel.getById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Charging station not found' });
    }
    res.json({ success: true, data: station });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const station = await ChargingStationModel.create(req.body);
    res.status(201).json({ success: true, message: 'Charging station created successfully', data: station });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const station = await ChargingStationModel.update(req.params.id, req.body);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Charging station not found' });
    }
    res.json({ success: true, message: 'Charging station updated successfully', data: station });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const station = await ChargingStationModel.delete(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Charging station not found' });
    }
    res.json({ success: true, message: 'Charging station deleted successfully' });
  } catch (error) {
    next(error);
  }
};
