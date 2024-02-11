const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(String(process.env.DATABASE_URI))
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB