import redisClient from '~/core/redis'
import userModel, { IUser } from '~/models/user'

import {
	JWT_ACCESS_TOKEN_EXPIRED_IN,
	JWT_REFRESH_TOKEN_EXPIRED_IN,
} from '~/env.config'
import { GraphQLError } from 'graphql'
import { signJwt, verifyJwt } from '~/core/jwt'
import checkAuth from '~/middleware/check-auth'

interface SignupInput {
	name: string
	email: string
	password: string
	passwordConfirm: string
}

interface SignInInput {
	email: string
	password: string
}

/**
 * SignTokens function
 * @param {IUser} user - The user object
 * @returns {Object} - The tokens object
 */
const signTokens = async (user: IUser) => {
	// Create a Session
	await redisClient.set(user.id, JSON.stringify(user), {
		EX: 60 * 60,
	})

	// Create access token
	const access_token = signJwt({ user: user.id }, 'JWT_ACCESS_PRIVATE_KEY', {
		expiresIn: `${JWT_ACCESS_TOKEN_EXPIRED_IN}m`,
	})

	// Create refresh token
	const refresh_token = signJwt({ user: user.id }, 'JWT_REFRESH_PRIVATE_KEY', {
		expiresIn: `${JWT_REFRESH_TOKEN_EXPIRED_IN}m`,
	})

	return { access_token, refresh_token }
}

const createUser = async (input: SignupInput) => {
	const user = await userModel.create({
		name: input.name,
		email: input.email,
		password: input.password,
		passwordConfirm: input.passwordConfirm,
	})

	return user
}

const loginUser = async (input: SignInInput) => {
	const user = await userModel
		.findOne({ email: input.email })
		.select('+password +verified')

	if (
		!input.password ||
		input.password === '' ||
		!user ||
		!(await user.comparePasswords(input.password, user.password ?? ''))
	) {
		throw new GraphQLError('Invalid email or password', {
			extensions: {
				code: 'AUTHENTICATION_ERROR',
			},
		})
	}

	if (user?.password) {
		delete user.password
	}

	const { access_token, refresh_token } = await signTokens(user)

	return {
		access_token,
		refresh_token,
	}
}

const refreshToken = async (current_refresh_token: string) => {
	// Verify the refresh token
	const decoded = verifyJwt(current_refresh_token, 'JWT_REFRESH_PRIVATE_KEY')

	if (!decoded) {
		throw new GraphQLError('Could not refresh access token', {
			extensions: {
				code: 'FORBIDDEN',
			},
		})
	}

	// Check if the user session exists in Redis
	const session = await redisClient.get(decoded.user)

	if (!session) {
		throw new GraphQLError('User session has expired', {
			extensions: {
				code: 'FORBIDDEN',
			},
		})
	}

	// Find the user by the session ID and check if they are verified
	const user = await userModel
		.findById(JSON.parse(session)._id)
		.select('+verified')

	if (!user || !user.verified) {
		throw new GraphQLError('Could not refresh access token', {
			extensions: {
				code: 'FORBIDDEN',
			},
		})
	}

	// Generate new access and refresh tokens
	const { access_token, refresh_token } = await signTokens(user)

	// Return the new access token and refresh token
	return {
		access_token,
		refresh_token,
	}
}

const logout = async (user: IUser) => {
	if (user) {
		await redisClient.del(user._id.toString())
	}

	return true
}

export default {
	signTokens,
	createUser,
	loginUser,
	refreshToken,
	logout,
}
