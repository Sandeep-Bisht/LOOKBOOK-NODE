const ArtistRequest = require('../../../models/artist_requests');
const AllServices = require('../../../models/services');
const AllUsers = require('../../../models/Users');
const AllBlogs = require('../../../models/blog');
const userRoles = require('../../../models/user_roles')
const Artists = require('../../../models/artists')

exports.getAdminDashboardInitialData = async (req, res) => {
  try {
    const artistRequestCount = await ArtistRequest.countDocuments();
    const servicesCount = await AllServices.countDocuments();
    const usersCount = await AllUsers.countDocuments();
    const blogsCount = await AllBlogs.countDocuments();
    const userRolesCount = await userRoles.countDocuments();
    const artistsCount = await Artists.countDocuments();

    const data = {
      artistRequestCount,
      servicesCount,
      usersCount,
      blogsCount,
      userRolesCount,
      artistsCount,
    };

    console.log("Admin Dashboard Initial Data:", data);

    res.status(200).json({
      error: false,
      message: "Admin Dashboard Initial Data",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
