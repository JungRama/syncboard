import authController from '~/controllers/auth.controller.js'
import filesController from '~/controllers/files.controller'

export default {
	// Auth Users
	getMe: authController.getMe,
	refreshAccessToken: authController.refreshAccessToken,
	logoutUser: authController.logout,

	// Files
	getFiles: filesController.get,
	getFavorites: filesController.getFavorites,
	getFileById: filesController.getById,
}
