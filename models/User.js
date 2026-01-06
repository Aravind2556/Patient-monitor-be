const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: { type: Number, required: true, trim: true },
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    contact: { type: Number, required: true, validate: { validator: v => /^\d{10}$/.test(v), message: 'Contact must be a 10-digit number.' } },
    role: { type: String, enum: ['doctor', 'patient'], required: true, default: 'patient' },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    password: { type: String, required: true }
})

const userModel = mongoose.model('pm-users', userSchema)

module.exports = userModel

