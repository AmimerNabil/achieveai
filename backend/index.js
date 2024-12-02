const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const { verifyIdToken } = require('./firebase/firebase-admin');
require('dotenv').config();

const corsOptions = {
    origin: '*', // Your frontend's URL (Vite default port)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['ngrok-skip-browser-warning', 'Content-Type', 'Authorization'], // Allowed headers
    credentials: true,
};

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions))
app.use(verifyIdToken)

// MongoDB connection
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Routes
app.get('/api', (req, res) => {
    res.send(req.user);
});

// Start server
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

