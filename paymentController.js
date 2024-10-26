const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
    const { amount, currency, paymentMethodId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        res.json({ paymentIntent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
