const express = require("express");
const Plot = require("../models/Plot");
const router = express.Router();

router.get("/plots", async (req, res) => {
    try {
        const plots = await Plot.find();
        res.json(plots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/plots/:id", async (req, res) => {
    try {
        const plot = await Plot.findById(req.params.id);
        if (plot) res.json(plot);
        else res.status(404).json({ message: "Plot not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/plots/:id/purchase", async (req, res) => {
    try {
        const plot = await Plot.findById(req.params.id);
        if (plot.status === "Sold") {
            return res.status(400).json({ message: "Plot already sold" });
        }
        plot.ownedBy = req.body.userId; // Simulated user ID from the request
        plot.status = "Sold";
        await plot.save();
        res.json({ message: "Plot purchased successfully", plot });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
