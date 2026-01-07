const mongoose = require('mongoose')

const vibrationSchema = mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    patientId: { type: String, required: true },
    entries: [{
        entryId: { type: Number },
        temperature: { type: Number },
        airPressure: { type: Number },
        heartRate: { type: Number },
        spo2: { type: Number },
    }],
    closedAt: { type: Date }
}, {
    timestamps: true
})

const vibrationModel = mongoose.model('vibration-data', vibrationSchema)
module.exports = vibrationModel