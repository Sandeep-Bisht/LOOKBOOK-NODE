const Cart = require("../../models/cart");
const UserRole = require("../../models/user_roles")
const Role = require("../../models/roles")
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../../models/payments");
const Bookings = require("../../models/bookings")

exports.createOrder = async (req, res) => {
  try {
    const roleId = await UserRole.findOne({user_id:req.user._id}).select('role_id');
    
      if(!roleId || !roleId.role_id){
          return res.status(401).json({
                    error:true,
                    message:"Unautherized user role.",
                  })
      }

      const role = await Role.findById(roleId.role_id);

      if(!role || !role?.role){
        return res.status(401).json({
          error:true,
          message:"Unautherized user role.",
        })
      }

      if(!role?.role === 'user' && !role?.role === 'artist'){
        return res.status(401).json({
          error:true,
          message:"Unautherized user role.",
        })
      }

      const userCart = await Cart.find({user_id:req.user._id,status:'open'});

      if(!userCart || userCart.length === 0){
        return res.status(400).json({
          error:true,
          message:"No Cart Data.",
        })
      }

      var totalPrice = 0;
      var cartItems = [];

      for(let i =0; i < userCart.length; i++){
        cartItems.push(userCart[i]?._id)
        totalPrice += (userCart[i]?.service?.pricing?.totalPrice * userCart[i]?.sessions);
      }

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY,
      });

      const paymentOptions = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
        notes:  cartItems ,
      };

      try {
        instance.orders.create(paymentOptions, async (error, order) => {
          if (error) {
            return res
              .status(500)
              .json({ error, message: "Something Went Wrong In Payment!" });
          } else {

            let paymentData = {
              user_id: req.user._id,
              cart: cartItems,
              amount: order.amount ? order.amount : paymentOptions.amount,
              currency: order.currency
                ? order.currency
                : paymentOptions.currency,
              receipt: order.receipt ? order.receipt : paymentOptions.receipt,
              orderId: order.id ? order.id : null,
              rzp_order_createdAt: order.created_at ? order.created_at : null,
              payment_status: order.status ? order.status : "initiated",
              created_by: req.user._id,
            };

            Payment.create(paymentData)
              .then(async (result) => {
                if (result) {
                  return res.status(200).json({
                    error: false,
                    order,
                    payment: result,
                    message: "payment initiated successfully.",
                  });
                } else {
                  res.status(400).json({
                    error: true,
                    status: 400,
                    message: "Unable to create payment.",
                  });
                }
              })
              .catch((error) => {
                res.status(400).json({
                  error: true,
                  errorMessage: error.message,
                  status: 400,
                  message:
                    "Please provide correct information to create payment.",
                });
              });
          }
        });
      } catch (paymentError) {
        return res.status(500).json({
          error: paymentError,
          message: "Something Went Wrong in payment!",
        });
      }
  } catch (error) {
    res.status(500).json({
      error: true,
      errormessage:error.message,
      message: "please provide correct information",
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {

      let payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { $set: { paymentId: razorpay_payment_id, payment_status: "success" } },
        { new: true }
      );

      const cartData = await Cart.updateMany({_id:{ $in: payment.cart }},{ $set: { status:'closed' } },{ new: true });
      
      return res.status(200).json(payment);

    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};