import authController from "~/controllers/auth.controller.js";

export default {
  // Users
  getMe: authController.getMe,
  // Auth
  refreshAccessToken: authController.refreshAccessToken,
  logoutUser: authController.logout,
};
