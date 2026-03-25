const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//import routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

//import db connection
const connectDB = require('./config/db');

//create app
const app = express();

//middleware
app.use(express.json());
app.use(cors());


//use router files
app.use( "/api/menu", menuRoutes );
app.use( "/api/orders", orderRoutes );


//connect to db
connectDB();

//start server
const PORT = process.env.PORT || 5000;

app.listen( PORT, () => {
 console.log(`Server running on port ${PORT}`) 
});
