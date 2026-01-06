const mongoose = require('mongoose')

const thinkSpeakSchema = mongoose.Schema({
    id: { type: Number},
    tempeatrue: { type: Number},
    airPressure: { type: Number },
    heartRate: { type: Number },
    spo2: { type: Number },
    deviseId: { type: Number}
})

const thinkSpeakModel = mongoose.model('think-speak', thinkSpeakSchema)
module.exports = thinkSpeakModel