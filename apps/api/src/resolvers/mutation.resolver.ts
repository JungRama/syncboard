import authController from '~/controllers/auth.controller'
import fileController from '~/controllers/files.controller'

export default {
	signupUser: authController.signup,
	loginUser: authController.login,
	oAuth: authController.oAuth,

	createFile: fileController.create,
	updateFile: fileController.update,
}
