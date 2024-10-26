const WolframAlphaAPI = require("wolfram-alpha-api");
const waApi = WolframAlphaAPI(process.env.WOLFRAM_APP_ID);

// Function to calculate loan details using Wolfram Alpha
exports.calculateLoan = async (principal, rate, years) => {
    try {
        const query = `loan amortization schedule for principal ${principal}, rate ${rate}%, over ${years} years`;
        const result = await waApi.getFull(query);
        return result;
    } catch (error) {
        throw new Error("Error fetching loan data from Wolfram Alpha: " + error.message);
    }
};
