const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Generate JWT token for authentication
function generateJWT() {
    const payload = {
        iss: process.env.organizations/853016-892-47-bd71-cd6a7fffd6cf/apiKeys/282668-2221-49-8e80-24e09541,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 5 // Token valid for 5 minutes
    };

    const token = jwt.sign(payload, process.env.nMHcCAQEEICihwFUmC6SaGoVWXOURlz2CkYlAzMzYhJFA2n10pO34oAoGCCqGSM49nAwEHoUQDQgAEzoD2v9eDO8f4Rh0So3H9DyEbgOsgkj2y1K10CkVFI7l4g1KhouBAnakROboqI/iUOVQx1WgEmpIOnQDVJbf92yw==n, {
        algorithm: "ES256"
    });

    return token;
}

// Function to create a crypto payment charge
exports.createCryptoCharge = async (name, description, amount, currency) => {
    try {
        const token = generateJWT();

        const chargeData = {
            name: name,
            description: description,
            local_price: {
                amount: amount.toString(),
                currency: currency
            },
            pricing_type: "fixed_price"
        };

        const response = await axios.post(
            "https://api.commerce.coinbase.com/charges",
            chargeData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.hosted_url; // Replace with the actual response key if different
    } catch (error) {
        throw new Error("Error creating crypto charge: " + error.message);
    }
};
