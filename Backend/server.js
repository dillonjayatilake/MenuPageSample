const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

//import routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

//import db connection
const connectDB = require('./config/db');

//create app
const app = express();
const server = http.createServer(app);
// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

//middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Make io accessible to routes
app.set('io', io);

//use router files
app.use( "/api/menu", menuRoutes );
app.use( "/api/orders", orderRoutes );
app.use( "/api", authRoutes );

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

//connect to db
connectDB();

//start server
const PORT = process.env.PORT || 5000;

server.listen( PORT, () => {
 console.log(`Server running on port ${PORT}`) 
});
