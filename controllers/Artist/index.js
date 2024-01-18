const Artists = require("../../models/artists");
const Services = require("../../models/services");

exports.getAll = async (req, res) => {
  try {
    const allArtists = await Artists.find({ status: "active" }).populate(
      "profile_id"
    );
    return res.status(200).json(allArtists);
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Something went wrong please try again later.",
    });
  }
};

exports.getByID = async (req, res) => {
  try {
    const { artist_id } = { ...req.params };
    const artist = await Artists.findById(artist_id)
      .populate("profile_id")
      .populate("services")
      .populate("products");
    return res.status(200).json(artist);
  } catch (err) {
    res.status(404).json({
      error: true,
      message: "No Artist found with this ID.",
    });
  }
};

exports.get_artist_pricing = async (req, res) => {
  try {
    let user_id = req.user._id;
    const artist = await Artists.findOne({ user_id });
    const allServices = await Services.find();
    if (!allServices || Array.isArray(allServices._doc)) {
      return res.status(400).json({
        error: true,
        message: "No services found.",
      });
    }

    if (!artist) {
      return res.status(400).json({
        error: true,
        message: "Your artist data not available.",
      });
    }

    let artistPricing = [];
    artist.pricing.map((item) => {
      let artistService = allServices.find((el) => el._id.equals(item.service));
      if (artistService) {
        artistPricing.push({ ...item, service: artistService });
      } else {
        artistPricing.push(item);
      }
    });

    

    return res.status(200).json({
      error: false,
      pricing: artistPricing,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      message: "No Artist found with this ID.",
    });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    let user_id = req.user._id;

    let { serviceId, price, sessionTime, totalPrice } = req.body;

    const artist = await Artists.findOne({ user_id });

    if (!artist) {
      return res.status(400).json({
        error: true,
        message: "Your artist data is not available.",
      });
    }
    
    let serviceIndex = artist.pricing.findIndex((el) => el.service.equals(serviceId));

    if (serviceIndex !== -1) {
      // Update the properties of the found service in the array
      let updatedPricingData = artist.pricing;
      updatedPricingData[serviceIndex].price = price;
      updatedPricingData[serviceIndex].totalPrice = totalPrice;
      updatedPricingData[serviceIndex].sessionTime = sessionTime;     


      // to update perticular field in model use findOneAndUpdate

      let artistData = await Artists.findOneAndUpdate(
        { user_id},
        { $set: {'pricing':updatedPricingData} },
        { new: true }
      )

      return res.status(200).json({
        error: false,
        pricing: artistData.pricing,
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "Service not found.",
      });
    }
  } catch (error) {
    console.error("Error in updating Pricing:", error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
};

