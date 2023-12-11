import authController from '~/controllers/auth.controller.js'
import filesController from '~/controllers/files.controller'

export default {
	// Users
	getMe: authController.getMe,
	// Auth
	refreshAccessToken: authController.refreshAccessToken,
	logoutUser: authController.logout,
	// Files
	getFiles: filesController.get,
	getFileById: filesController.getById,
}
