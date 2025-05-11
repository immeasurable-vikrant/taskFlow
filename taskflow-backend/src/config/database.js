const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected successful!')
    } catch(err) {
        console.log("ERROR: DB connection failed -> ", err.message)
    }
}

module.exports = { connectDB }