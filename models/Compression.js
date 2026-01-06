const mongoose = require('mongoose')

const compressionSchema = mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    patientId: { type: String, required: true },
    entries: [{
        temperature: { type: Number },
        airPressure: { type: Number },
        heartRate: { type: Number },
        spo2: { type: Number },
    }]
}, {
    timestamps: true
})

const compressionModel = mongoose.model('compression-data', compressionSchema)
module.exports = compressionModel