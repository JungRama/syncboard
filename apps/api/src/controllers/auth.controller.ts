import { GraphQLError } from 'graphql'
import userModel, { IUser } from '~/models/user'
import redisClient from '~/core/redis'
import errorHandler from '~/controllers/error.controller'

import { signJwt, verifyJwt } from '~/core/jwt'

import type { Request, Response } from 'express'

import {
	JWT_ACCESS_TOKEN_EXPIRED_IN,
	JWT_REFRESH_TOKEN_EXPIRED_IN,
} from '~/env.config'
import { UserAuthFn } from '~/middleware/user-auth'
import checkAuth from '~/middleware/check-auth'

interface SignupInput {
	input: {
		name: string
		email: string
		password: string
		passwordConfirm: string
	}
}

interface SignInInput {
	input: {
		name: string
		email: string
		password: string
		passwordConfirm: string
	}
}

const cookieOptions = {
	httpOnly: true,
	sameSite: false,
	secure: true,
}

const accessTokenCookieOptions = {
	...cookieOptions,
	maxAge: JWT_ACCESS_TOKEN_EXPIRED_IN * 60 * 1000,
	expires: new Date(Date.now() + JWT_ACCESS_TOKEN_EXPIRED_IN * 60 * 1000),
}

const refreshTokenCookieOptions = {
	...cookieOptions,
	maxAge: JWT_REFRESH_TOKEN_EXPIRED_IN * 60 * 1000,
	expires: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRED_IN * 60 * 1000),
}

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

/**
 * Signup function
 * @param {Object} parent - The parent object
 * @param {SignupInput} args - The input arguments
 * @param {Object} context - The context object
 * @returns {Object} - The result object
 */
const signup = async (
	parent: any,
	{ input: { name, email, password, passwordConfirm } }: SignupInput,
	{ req }: { req: Request }
) => {
	try {
		const user = await userModel.create({
			name,
			email,
			password,
			passwordConfirm,
		})

		return {
			status: 'success',
			user,
		}
	} catch (error) {
		if (error.code === 11000) {
			throw new GraphQLError('User Already Exist', {
				extensions: {
					code: 'FORBIDDEN',
				},
			})
		}
		errorHandler(error)
	}
}

/**
 * SignTokens function
 * @param {IUser} user - The user object
 * @returns {Object} - The tokens object
 */
async function signTokens(user: IUser) {
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

/**
 * Login function
 * @param {Object} parent - The parent object
 * @param {SignInInput} args - The input arguments
 * @param {Object} context - The context object
 * @returns {Object} - The result object
 */
const login = async (
	parent: any,
	{ input: { email, password } }: SignInInput,
	{ req, res }: { req: Request; res: Response }
) => {
	try {
		const user = await userModel
			.findOne({ email })
			.select('+password +verified')

		if (
			!user ||
			!(await user.comparePasswords(password, user.password ?? ''))
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

		res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
		res.cookie('access_token', access_token, accessTokenCookieOptions)
		res.cookie('logged_in', true, {
			...accessTokenCookieOptions,
			httpOnly: false,
		})

		return {
			status: 'success',
			access_token,
			refresh_token,
		}
	} catch (error) {
		errorHandler(error)
	}
}

/**
 * Refreshes the access token.
 *
 * @param parent - The parent object.
 * @param args - The arguments passed to the function.
 * @param req - The request object.
 * @param res - The response object.
 * @returns An object containing the new access token and refresh token.
 */
const refreshAccessToken = async (
	parent: any,
	args: any,
	{ req, res }: { req: Request; res: Response }
) => {
	try {
		const { refresh_token: current_refresh_token } = args

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

		// Set the new refresh token and access token as cookies
		res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
		res.cookie('access_token', access_token, accessTokenCookieOptions)
		res.cookie('logged_in', true, {
			...accessTokenCookieOptions,
			httpOnly: false,
		})

		// Return the new access token and refresh token
		return {
			status: 'success',
			access_token,
			refresh_token,
		}
	} catch (error) {
		errorHandler(error)
	}
}

/**
 * Logs out the user.
 *
 * @param parent - The parent object.
 * @param args - The arguments.
 * @param req - The request object.
 * @param res - The response object.
 * @param userAuth - The user authentication function.
 * @returns A boolean indicating if the logout was successful.
 */
const logout = async (
	parent: any,
	args: any,
	{ req, res, userAuth }: { req: Request; res: Response; userAuth: UserAuthFn }
) => {
	try {
		await checkAuth(req, userAuth)

		const user = await userAuth(req)

		if (user) {
			await redisClient.del(user._id.toString())
		}

		res.cookie('access_token', '', { maxAge: -1 })
		res.cookie('refresh_token', '', { maxAge: -1 })
		res.cookie('logged_in', '', { maxAge: -1 })

		return true
	} catch (error) {
		errorHandler(error)
	}
}

/**
 * Retrieves information about the currently authenticated user.
 * @param parent - The parent object.
 * @param args - The arguments passed to the function.
 * @param req - The request object.
 * @param userAuth - The user authentication function.
 * @returns An object containing the status and the user information.
 */
const getMe = async (
	parent: any,
	args: any,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		// Check if the user is authenticated
		await checkAuth(req, userAuth)

		// Get the authenticated user
		const user = await userAuth(req)

		return {
			status: 'success',
			user,
		}
	} catch (error) {
		// Handle any errors that occur
		errorHandler(error)
	}
}

export default {
	signup,
	login,
	logout,
	getMe,
	refreshAccessToken,
}
