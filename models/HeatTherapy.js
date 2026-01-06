const mongoose = require('mongoose')

const heatTherapySchema = mongoose.Schema({
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

const heatTherapyModel = mongoose.model('heat-therapy-data', heatTherapySchema)
module.exports = heatTherapyModel