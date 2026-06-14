const path = require('path');
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes     = require('./routes/auth.routes');
const userRoutes     = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const uploadRoutes   = require('./routes/upload.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites',  favoriteRoutes);
app.use('/api/upload',     uploadRoutes);

app.use(errorHandler);

module.exports = app;
