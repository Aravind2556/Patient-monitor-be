const express = require("express");
const fetch = require("node-fetch");
const Compression = require("../models/Compression");

const CompressRouter = express.Router();

// CompressRouter.get("/fetchcompressor/:id", async (req, res) => {
//     try {
//         const patientId = req.params.id
//         const fecthCompressDetail = await Compression.find({ patientId})
//         let fetchCompressHistory = fecthCompressDetail.map(vibration => {
//             const duration = Math.floor(
//                 (new Date(vibration.closedAt) - new Date(vibration.createdAt)) / (1000 * 60))

//             // calculate average temperature safely
//             const totalTemp = vibration.entries.reduce(
//                 (sum, entry) => sum + (entry.temperature || 0),
//                 0
//             );
//             let avgTemp = vibration.entries.length
//                 ? totalTemp / vibration.entries.length
//                 : 0;
//             // console.log("avgTemp", avgTemp)
//             return ({
//                 SessionId: vibration.id,
//                 Date: vibration.updatedAt,
//                 Duration: duration,
//                 AverageTemp: avgTemp
//             })
//         }
//         )
//         if (fetchCompressHistory.length === 0){
//             return res.json({ success: false, message: 'Patient Vibration not Found!', patientCompression : []});
//         }
           
//        //  Excel download
//        if(req.query.type === "compress"){
//             if (!["patient", "doctor"].includes(req.session.use.role)) {
//                 return res.status(403).json({ success: false, message: 'Not authorized to download compress data.' });
//             }

//             const worksheet = xlsx.utils.json_to_sheet(fetchCompressHistory);
//             const workbook = xlsx.utils.book_new();

//             xlsx.utils.book_append_sheet(workbook, worksheet, 'HeatTherapy History');

//             res.setHeader(
//                 'Content-Type',
//                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//             );
//             res.setHeader(
//                 'Content-Disposition',
//                 'attachment; filename="HeatTherapy_History.xlsx"'
//             );

//             const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
//             return res.end(buffer);
      
//        }

//         return res.json({ success: true, message: 'Patient Details fetched successfully!', patientCompression: fetchCompressHistory });


//     }
//     catch (err) {
//         console.log("Trouble in Fetch Patient Vibration Details:", err)
//         return res.json({ success: false, message: "Trouble in Fetch Patient Vibration Details! Please contact support Team." })
//     }
// });



CompressRouter.get("/fetchcompressor/:id", async (req, res) => {
    try {
        const patientId = req.params.id;
        const { type } = req.query;
        const role = req.session?.user?.role;

        const heatTherapySessions = await Compression.find({ patientId });

        console.log("heatTherapySessions", heatTherapySessions)

        const finalHeatHistory = heatTherapySessions.map((session) => {
            const duration = Math.floor(
                (new Date(session.closedAt) - new Date(session.createdAt)) / (1000 * 60)
            );

            const totalTemp = session.entries.reduce(
                (sum, entry) => sum + (entry.temperature || 0),
                0
            );
            const avgTemp = session.entries.length ? totalTemp / session.entries.length : 0;

            return {
                SessionId: session.id,
                Date: session.updatedAt,
                Duration: duration,
                AverageTemp: avgTemp
            };
        });

        if (finalHeatHistory.length === 0) {
            return res.json({ success: false, message: 'Patient Heat Therapy not Found!', patientHeatTherpy: [] });
        }

        const wantsExcel = type === 'compress';

        if (wantsExcel) {
            if (!["patient", "doctor"].includes(role)) {
                return res.status(403).json({ success: false, message: 'Not authorized to download heat therapy data.' });
            }

            const worksheet = xlsx.utils.json_to_sheet(finalHeatHistory);
            const workbook = xlsx.utils.book_new();

            xlsx.utils.book_append_sheet(workbook, worksheet, 'HeatTherapy History');

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename="HeatTherapy_History.xlsx"'
            );

            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return res.end(buffer);
        }

        return res.json({ success: true, message: 'Patient Details fetched successfully!', patientCompression: finalHeatHistory });
    }
    catch (err) {
        console.log("Trouble in Fetch Patient Heat Therapy Details:", err);
        return res.json({ success: false, message: "Trouble in Fetch Patient Heat Therapy Details! Please contact support Team." });
    }
});

module.exports = CompressRouter;
