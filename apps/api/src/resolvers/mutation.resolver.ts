import authController from '~/controllers/auth.controller'
import fileController from '~/controllers/files.controller'

export default {
	signupUser: authController.signup,
	loginUser: authController.login,

	createFile: fileController.create,
	updateFile: fileController.update,
	// deleteFile
}
