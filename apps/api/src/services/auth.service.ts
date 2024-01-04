import redisClient from '~/core/redis'
import userModel, { IUser } from '~/models/user'

import { GraphQLError } from 'graphql'
import { signJwt, verifyJwt } from '~/core/jwt'
import {
	FRONT_URI,
	JWT_ACCESS_TOKEN_EXPIRED_IN,
	JWT_REFRESH_TOKEN_EXPIRED_IN,
} from '~/env.config'

import mailService from './mail.service'
import authService from './auth.service'

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
	let user = await userModel.findOne({ email: input.email })

	if (user && !user.verified) {
		user.name = input.name
		user.password = input.password

		user.save()
	} else {
		user = await userModel.create({
			name: input.name,
			email: input.email,
			password: input.password,
			passwordConfirm: input.passwordConfirm,
			verified: false,
		})
	}

	await mailService.userRegisterEmail(
		input.name,
		input.email,
		FRONT_URI + `/callback/verify?code=${user?.id}`
	)

	delete user?.id

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

	if (!user.verified) {
		throw new GraphQLError('Please verify your email address', {
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

const verifyAccount = async (id: string) => {
	const user = await userModel.findOne({
		id,
		verified: false,
	})

	if (!user) {
		throw new GraphQLError('User not found', {
			extensions: {
				code: 'NOT_FOUND',
			},
		})
	}

	user.verified = true
	await user.save()

	const { access_token, refresh_token } = await authService.signTokens(user)

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
	verifyAccount,
	logout,
}
