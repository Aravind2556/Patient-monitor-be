const express = require('express');
const PatientModel = require('../models/User');
const isAuth = require('../middleware/isAuth');
const VibrationModel = require('../models/Vibration')


const VibrationRouter = express.Router();


VibrationRouter.get('/fetchVibration/:id', isAuth, async (req, res) => {
    try {

        const patientId = req.params.id

        const fetchVibrationDetail = await VibrationModel.find({ patientId: patientId })
        // console.log("fetchVibrationDetail", fetchVibrationDetail)
        let finalVibrationHistory = fetchVibrationDetail.map(vibration => {
            const duration = Math.floor(
                (new Date(vibration.updatedAt) - new Date(vibration.createdAt)) / (1000 * 60))

            // calculate average temperature safely
            const totalTemp = vibration.entries.reduce(
                (sum, entry) => sum + (entry.temperature || 0),
                0
            );
            let avgTemp = vibration.entries.length
                ? totalTemp / vibration.entries.length
                : 0;
            // console.log("avgTemp", avgTemp)
            return ({
                sessionId: vibration.id,
                date: vibration.updatedAt,
                duration: duration,
                averageTemp: avgTemp
            })
        }
        )
        // console.log("finalVibrationHistory", finalVibrationHistory)

        if (!finalVibrationHistory)
            return res.json({ success: false, message: 'Patient Vibration not Found!' });

        if (req.session.user.role === 'patient')
            return res.json({ success: true, message: 'Patient Details fetched successfully!', patientVibration: finalVibrationHistory });
        else {

        }

    }
    catch (err) {
        console.log("Trouble in Fetch Patient Vibration Details:", err)
        return res.json({ success: false, message: "Trouble in Fetch Patient Vibration Details! Please contact support Team." })
    }
})


module.exports = VibrationRouter