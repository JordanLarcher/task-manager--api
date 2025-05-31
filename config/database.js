const mongoose = require('mongoose');
const winston = require('winston');


const connectDB = async () =>  {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        winston.info('Connected to Mongo database');
    } catch (err) {
        winston.error(`Failed to connect to database: ${err.message}`);
        throw err;
    }
}

module.exports = connectDB;