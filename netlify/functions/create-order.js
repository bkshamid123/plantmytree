const Razorpay = require("razorpay");

exports.handler = async (event) => {

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  try {
    const order = await razorpay.orders.create({
      amount: 5000, // ₹50
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    return {
      statusCode: 200,
      body: JSON.stringify(order)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
