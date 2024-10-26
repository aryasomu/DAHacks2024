const wolframService = require("../services/wolframService");

exports.calculateLoan = async (req, res) => {
    const { principal, rate, years } = req.body;

    try {
        const loanDetails = await wolframService.calculateLoan(principal, rate, years);
        res.json(loanDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
