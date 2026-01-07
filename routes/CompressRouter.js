const express = require("express");
const fetch = require("node-fetch");
const xlsx = require("xlsx");
const Compression = require("../models/Compression");

const CompressRouter = express.Router();

CompressRouter.get("/fetchcompressor/:id", async (req, res) => {
    try {
        const patientId = req.params.id;
        const { download } = req.query;
        const role = req.session?.user?.role;

        const compressionSession = await Compression.find({ patientId });

        const finalHeatHistory = compressionSession.map((session) => {
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
            return res.json({ success: false, message: 'Patient Compress not Found!', patientHeatTherpy: [] });
        }

        const wantsExcel = download === 'excel';

        if (wantsExcel) {
            if (!["patient", "doctor"].includes(role)) {
                return res.status(403).json({ success: false, message: 'Not authorized to download compress data.' });
            }

            const worksheet = xlsx.utils.json_to_sheet(finalHeatHistory);
            const workbook = xlsx.utils.book_new();

            xlsx.utils.book_append_sheet(workbook, worksheet, 'Compression History');

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
        console.log("Trouble in Fetch Patient compression Details:", err);
        return res.json({ success: false, message: "Trouble in Fetch Patient compression Details! Please contact support Team." });
    }
});

module.exports = CompressRouter;
