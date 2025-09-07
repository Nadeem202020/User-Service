
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const globalExceptionHandler = require('./src/middleware/globalExceptionHandler');
const DataInitializer = require('./src/config/dataInitializer');

const app = express();

app.use(express.json());

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route handlers
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Centralized error handling
app.use(globalExceptionHandler);

// Connect to the database if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    mongoose
        .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.log(err));
}

// Initialize data if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    mongoose.connection.once('open', () => {
        DataInitializer.initialize();
    });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
