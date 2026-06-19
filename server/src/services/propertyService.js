const propertyRepo = require('../repositories/propertyRepository');

const buildFilter = ({ city, minPrice, maxPrice }) => {
  const filter = {};
  if (city) filter.city = { $regex: new RegExp(city, 'i') };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }
  return filter;
};

const buildSort = (sortBy) => {
  if (sortBy === 'price_asc')  return { price: 1 };
  if (sortBy === 'price_desc') return { price: -1 };
  return { createdAt: -1 };
};

const getAllProperties = async (query) => {
  const filter = buildFilter(query);
  const sort   = buildSort(query.sortBy);
  return propertyRepo.findAll(filter, sort);
};

const getPropertyById = async (id) => {
  const property = await propertyRepo.findById(id);
  if (!property) {
    const err = new Error('Property not found');
    err.statusCode = 404;
    throw err;
  }
  return property;
};

const getMyProperties = async (userId) => propertyRepo.findByOwner(userId);

const createProperty = async (userId, data) => {
  const { title, description, price, city, country, type, imageUrls } = data;
  if (!title || !description || price === undefined || !city || !country || !type) {
    const err = new Error('title, description, price, city, country, and type are required');
    err.statusCode = 400;
    throw err;
  }
  if (!['Apartment', 'House', 'Studio'].includes(type)) {
    const err = new Error('type must be Apartment, House, or Studio');
    err.statusCode = 400;
    throw err;
  }
  if (isNaN(Number(price)) || Number(price) < 0) {
    const err = new Error('price must be a non-negative number');
    err.statusCode = 400;
    throw err;
  }
  return propertyRepo.create({ title, description, price, city, country, type, imageUrls, owner: userId });
};

const updateProperty = async (userId, propertyId, data) => {
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    const err = new Error('Property not found');
    err.statusCode = 404;
    throw err;
  }
  if (property.owner._id.toString() !== userId.toString()) {
    const err = new Error('You are not authorized to update this property');
    err.statusCode = 403;
    throw err;
  }

  const allowed = {};
  const fields = ['title', 'description', 'price', 'city', 'country', 'type', 'imageUrls'];
  fields.forEach((f) => { if (data[f] !== undefined) allowed[f] = data[f]; });

  if (allowed.type && !['Apartment', 'House', 'Studio'].includes(allowed.type)) {
    const err = new Error('type must be Apartment, House, or Studio');
    err.statusCode = 400;
    throw err;
  }

  return propertyRepo.updateById(propertyId, allowed);
};

const deleteProperty = async (userId, propertyId) => {
  const property = await propertyRepo.findById(propertyId);
  if (!property) {
    const err = new Error('Property not found');
    err.statusCode = 404;
    throw err;
  }
  if (property.owner._id.toString() !== userId.toString()) {
    const err = new Error('You are not authorized to delete this property');
    err.statusCode = 403;
    throw err;
  }
  await propertyRepo.deleteById(propertyId);
  return { message: 'Property deleted successfully' };
};

module.exports = {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
