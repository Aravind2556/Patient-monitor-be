const express = require("express");
const fetch = require("node-fetch");
const Compression = require("../models/Compression");

const CompressRouter = express.Router();

CompressRouter.get("/compressor", async (req, res) => {
    try {
        const allCompression = await Compression.find({})
        console.log("allCompression", allCompression)
    
    } catch (err) {
        console.error("Compressor API error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = CompressRouter;
