const propertyService = require('../services/propertyService');

const getAllProperties = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const properties = await propertyService.getAllProperties({ city, minPrice, maxPrice });
    res.status(200).json({ properties });
  } catch (err) {
    next(err);
  }
};

const getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    res.status(200).json({ property });
  } catch (err) {
    next(err);
  }
};

const getMyProperties = async (req, res, next) => {
  try {
    const properties = await propertyService.getMyProperties(req.user.id);
    res.status(200).json({ properties });
  } catch (err) {
    next(err);
  }
};

const createProperty = async (req, res, next) => {
  try {
    const property = await propertyService.createProperty(req.user.id, req.body);
    res.status(201).json({ property });
  } catch (err) {
    next(err);
  }
};

const updateProperty = async (req, res, next) => {
  try {
    const property = await propertyService.updateProperty(req.user.id, req.params.id, req.body);
    res.status(200).json({ property });
  } catch (err) {
    next(err);
  }
};

const deleteProperty = async (req, res, next) => {
  try {
    const result = await propertyService.deleteProperty(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
