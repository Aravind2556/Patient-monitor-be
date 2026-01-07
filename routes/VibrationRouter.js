const express = require('express');
const PatientModel = require('../models/User');
const isAuth = require('../middleware/isAuth');
const VibrationModel = require('../models/Vibration')
const xlsx = require('xlsx')


const VibrationRouter = express.Router();


VibrationRouter.get('/fetchVibration/:id', isAuth, async (req, res) => {
    try {

        const patientId = req.params.id
        const { download } = req.query;
        const role = req.session?.user?.role;

        const fetchVibrationDetail = await VibrationModel.find({ patientId: patientId })
        // console.log("fetchVibrationDetail", fetchVibrationDetail)
        let finalVibrationHistory = fetchVibrationDetail.map(vibration => {
            const duration = Math.floor(
                (new Date(vibration.closedAt) - new Date(vibration.createdAt)) / (1000 * 60))

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
                SessionId: vibration.id,
                Date: vibration.updatedAt,
                Duration: duration,
                AverageTemp: avgTemp
            })
        }
        )
        // console.log("finalVibrationHistory", finalVibrationHistory)

        if (finalVibrationHistory.length === 0)
            return res.json({ success: false, message: 'Patient Vibration not Found!' });

        const wantsExcel = download === 'excel';

        //  Excel download
        if (wantsExcel) {
            if (!["patient", "doctor"].includes(role)) {
                return res.status(403).json({ success: false, message: 'Not authorized to download compress data.' });
            }
            const worksheet = xlsx.utils.json_to_sheet(finalVibrationHistory);
            const workbook = xlsx.utils.book_new();

            xlsx.utils.book_append_sheet(workbook, worksheet, 'Vibration History');

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="Vibration_History.xlsx"'
            );

            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return res.end(buffer);
        }
        return res.json({ success: true, message: 'Patient Details fetched successfully!', patientVibration: finalVibrationHistory });

    }
    catch (err) {
        console.log("Trouble in Fetch Patient Vibration Details:", err)
        return res.json({ success: false, message: "Trouble in Fetch Patient Vibration Details! Please contact support Team." })
    }
})


module.exports = VibrationRouter