const crypto = require("crypto");

exports.handler = async (event) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id } = JSON.parse(event.body);

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {

    // SAVE TO SUPABASE
    const { createClient } = require("@supabase/supabase-js");

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    await supabase.from("transactions").insert([
      {
        user_id,
        trees: 5,
        amount: 50
      }
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false })
    };
  }
};
