const mongoose = require('mongoose')

const compressionSchema = mongoose.Schema({
    id: { type: Number},
    patientId: { type: String },
    entries: [{
        temperature: { type: Number },
        airPressure: { type: Number },
        heartRate: { type: Number },
        spo2: { type: Number },
    }]
}, {
    timestamps: true
})

const thinkSpeakModel = mongoose.model('compression-data', thinkSpeakSchema)
module.exports = thinkSpeakModel