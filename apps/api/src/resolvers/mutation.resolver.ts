import authController from '~/controllers/auth.controller'
import fileController from '~/controllers/files.controller'

export default {
	// Auth User
	signupUser: authController.signup,
	loginUser: authController.login,
	oAuth: authController.oAuth,

	// Files
	createFile: fileController.create,
	updateFile: fileController.update,
	addNewUserAccess: fileController.addNewUserAccess,
	changeUserAccess: fileController.changeUserAccess,
}
