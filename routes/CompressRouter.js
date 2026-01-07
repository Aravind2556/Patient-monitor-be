const express = require("express");
const fetch = require("node-fetch");
const Compression = require("../models/Compression");

const CompressRouter = express.Router();

CompressRouter.get("/fetchcompressor/:id", async (req, res) => {
    try {
        const patientId = req.params.id
        const fetchVibrationDetail = await Compression.find({ patientId})
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
                SessionId: vibration.id,
                Date: vibration.updatedAt,
                Duration: duration,
                AverageTemp: avgTemp
            })
        }
        )
        // console.log("finalVibrationHistory", finalVibrationHistory)

        console.log("finalVibrationHistory", finalVibrationHistory)

        if (finalVibrationHistory.length === 0){
            return res.json({ success: false, message: 'Patient Vibration not Found!', patientCompression : []});
        }
           
        if (req.session.user.role === 'patient'){
            return res.json({ success: true, message: 'Patient Details fetched successfully!', patientCompression: finalVibrationHistory });
        }
        const type = req.query.type; 

        console.log("req.query.type", type)
    
       //  Excel download
       if(req.query.type === "compress"){

           if (finalVibrationHistory.length === 0) {
               return res.json({ success: false, message: 'Patient Vibration not Found!', patientCompression: [] });
           }
           
           if (["patient", 'doctor'].includes(req.session.user.role)) {
               console.log("jhtognhtu")
               const worksheet = xlsx.utils.json_to_sheet(finalVibrationHistory);
               const workbook = xlsx.utils.book_new();

               xlsx.utils.book_append_sheet(workbook, worksheet, 'Compression History');

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
       }


    }
    catch (err) {
        console.log("Trouble in Fetch Patient Vibration Details:", err)
        return res.json({ success: false, message: "Trouble in Fetch Patient Vibration Details! Please contact support Team." })
    }
});

module.exports = CompressRouter;
