const ProfileService = require("./profileService");

module.exports = {
  createProfile: async (req, res) => {
    console.log("inisde create profile", req.body);
    try {
      let profileData = { ...req.body };
      console.log(profileData, "profileData");
      if (Object.keys(profileData).length === 0) {
        res.send("Please fill all the fields");
      } else {
        ProfileService.create(profileData).then((result) => {
          if (result) {
            res.send("Profile data is inserted");
          }
        }).catch((err) => {
            if (err.code === 11000) {
              res.send("Profile already exists")
            }
          });
      }
    } catch (error) {
      console.log("this is error", error);
      res.send("error", error);
    }
  },
};
