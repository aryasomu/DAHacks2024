const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

exports.createDeed = async (plotId, plotName, plotCoordinates, ownerAddress) => {
    try {
        const metadata = {
            name: plotName,
            description: `Deed for plot ${plotName} located at coordinates ${plotCoordinates}.`,
            plot_id: plotId,
            coordinates: plotCoordinates,
            owner: ownerAddress
        };

        const response = await axios.post(
            "https://api.verbwire.com/v1/nft/mint",
            {
                chain: "ethereum", // or another supported blockchain
                recipientAddress: ownerAddress,
                metadata: metadata
            },
            {
                headers: {
                    "X-API-Key": process.env.sk_live_cc037174-510-413-8e1-ff4f49e40f70, // Use the secret key from .env
                    "Content-Type": "application/json"
                }
            }
        );

        const deedId = response.data.sk_live_cc037174-510-413-8e1-ff4f49e40f70;
        return deedId;

    } catch (error) {
        throw new Error("Error minting deed on Verbwire: " + error.message);
    }
};
