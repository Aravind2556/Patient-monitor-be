const mongoose = require('mongoose')

const heatTherapySchema = mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    patientId: { type: Number, required: true },
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

const heatTherapyModel = mongoose.model('heat-therapy-data', heatTherapySchema)
module.exports = heatTherapyModel