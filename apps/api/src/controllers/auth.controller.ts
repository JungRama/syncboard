import { GraphQLError } from 'graphql'
import errorHandler from '~/controllers/error.controller'

import type { Request, Response } from 'express'

import checkAuth from '~/middleware/check-auth'
import { UserAuthFn } from '~/middleware/user-auth'
import authService from '~/services/auth.service'
import { continueWithOAuth } from '~/services/oauth.service'

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

interface oAuthInput {
	input: {
		strategy: string
		code: string
	}
}

const signup = async (
	root: any,
	{ input: { name, email, password, passwordConfirm } }: SignupInput,
	{ req }: { req: Request }
) => {
	try {
		await authService.createUser({
			name,
			email,
			password,
			passwordConfirm,
		})

		return true
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

const login = async (
	root: any,
	{ input: { email, password } }: SignInInput,
	{ req }: { req: Request }
) => {
	try {
		const loginService = await authService.loginUser({
			email,
			password,
		})

		return {
			access_token: loginService?.access_token,
			refresh_token: loginService?.refresh_token,
		}
	} catch (error) {
		errorHandler(error)
	}
}

const oAuth = async (
	root: any,
	{ input: { strategy, code } }: oAuthInput,
	{ req }: { req: Request }
) => {
	try {
		const oAuthService = await continueWithOAuth(strategy, code)

		return {
			access_token: oAuthService?.access_token,
			refresh_token: oAuthService?.refresh_token,
		}
	} catch (error) {
		errorHandler(error)
	}
}

const refreshAccessToken = async (
	root: any,
	{ refresh_token }: { refresh_token: string },
	{ req }: { req: Request }
) => {
	try {
		const refreshTokenService = await authService.refreshToken(refresh_token)

		return {
			access_token: refreshTokenService?.access_token,
			refresh_token: refreshTokenService?.refresh_token,
		}
	} catch (error) {
		errorHandler(error)
	}
}

const verifyAccount = async (
	root: any,
	{ input: { code } }: { input: { code: string } },
	{ req }: { req: Request }
) => {
	try {
		const verifyAccount = await authService.verifyAccount(code)

		return {
			access_token: verifyAccount?.access_token,
			refresh_token: verifyAccount?.refresh_token,
		}
	} catch (error) {
		errorHandler(error)
	}
}

const logout = async (
	root: any,
	args: any,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		authService.logout(user)

		return true
	} catch (error) {
		errorHandler(error)
	}
}

const getMe = async (
	root: any,
	args: any,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		return {
			status: 'success',
			user,
		}
	} catch (error) {
		errorHandler(error)
	}
}

export default {
	signup,
	login,
	oAuth,
	verifyAccount,
	logout,
	getMe,
	refreshAccessToken,
}
