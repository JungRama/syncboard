import { GraphQLError } from 'graphql'
import { UserAuthFn } from './user-auth.js'
import { Request } from 'express'

/**
 * Checks if the user is authenticated.
 *
 * @param {Request} req - The request object.
 * @param {UserAuthFn} userAuth - The function to authenticate the user.
 */
const checkAuth = async (req: Request, userAuth: UserAuthFn) => {
	// Authenticate the user
	const authUser = await userAuth(req)

	if (!authUser) {
		// Throw an error if user is not authenticated
		throw new GraphQLError('You are not logged in', {
			extensions: {
				code: 'UNAUTHENTICATED',
			},
		})
	}

	return authUser
}

export default checkAuth
