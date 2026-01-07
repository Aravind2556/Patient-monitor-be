const mongoose = require('mongoose')

const vibrationSchema = mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    patientId: { type: Number, required: true },
    entries: [{
        temperature: { type: Number },
        airPressure: { type: Number },
        heartRate: { type: Number },
        spo2: { type: Number },
    }]
}, {
    timestamps: true
})

const vibrationModel = mongoose.model('vibration-data', vibrationSchema)
module.exports = vibrationModel