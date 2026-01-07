const express = require("express");
const fetch = require("node-fetch");
const Compression = require("../models/Compression");

const CompressRouter = express.Router();

CompressRouter.get("/compressor", async (req, res) => {
    try {
        const allCompression = await Compression.find({});
        console.log("allCompression", allCompression);
        return res.status(200).json({
            success: true,
            data: allCompression
        });
    } catch (err) {
        console.error("Compressor API error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
});


module.exports = CompressRouter;
