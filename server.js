const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Import routes
const eventsRouter = require('./routes/events');
app.use('/events', eventsRouter);

// Define port from .env
const port = process.env.PORT || 8080;

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
