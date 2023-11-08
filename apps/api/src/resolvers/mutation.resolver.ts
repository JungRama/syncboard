import authController from "~/controllers/auth.controller";

export default {
  signupUser: authController.signup,
  loginUser: authController.login,
};
