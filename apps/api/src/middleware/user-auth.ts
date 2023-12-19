import { GraphQLError } from 'graphql'
import userModel, { IUser } from '~/models/user'
import redisClient from '~/core/redis'
import { verifyJwt } from '~/core/jwt'
import { Request } from 'express'

export type UserAuthFn = typeof userAuth

/**
 * Function to authenticate user.
 * @param req - Express request object.
 * @returns {Promise<boolean | IUser>} - Returns false if authentication fails, otherwise returns the authenticated user.
 */
const userAuth = async (req: Request) => {
	try {
		// Get the access token
		let access_token
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			access_token = req.headers.authorization.split(' ')[1]
		} else if (req.cookies.access_token) {
			const { access_token: token } = req.cookies
			access_token = token
		}

		if (!access_token) return false

		// Validate the Access token
		const decoded = verifyJwt(access_token, 'JWT_ACCESS_PRIVATE_KEY')

		if (!decoded) return false

		// Check if the session is valid
		const session = await redisClient.get(decoded.user)

		if (!session) {
			throw new GraphQLError('Session has expired', {
				extensions: {
					code: 'FORBIDDEN',
				},
			})
		}

		// Check if user exist
		const user = await userModel
			.findById(JSON.parse(session).id)
			.select('+verified')

		if (!user || !user.verified) {
			throw new GraphQLError(
				'The user belonging to this token no longer exists',
				{
					extensions: {
						code: 'FORBIDDEN',
					},
				}
			)
		}

		return user as IUser
	} catch (error) {
		return false
	}
}

export default userAuth
