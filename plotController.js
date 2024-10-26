const Plot = require("../models/Plot");

exports.getAllPlots = async (req, res) => {
    try {
        const plots = await Plot.find();
        res.json(plots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.purchasePlot = async (req, res) => {
    const { plotId, userId } = req.body;

    try {
        const plot = await Plot.findById(plotId);
        if (plot.status === "Sold") {
            return res.status(400).json({ message: "Plot already sold" });
        }

        const deedService = require("../services/deedService");
        const deedId = await deedService.createDeed(plotId);

        plot.ownedBy = userId;
        plot.status = "Sold";
        plot.deedId = deedId;
        await plot.save();

        res.json({ message: "Plot purchased successfully", plot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
