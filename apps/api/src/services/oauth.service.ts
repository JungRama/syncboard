import axios from 'axios'
import { GraphQLError } from 'graphql'
import userModel from '~/models/user'
import authService from './auth.service'

export const getOAuthProfile = async (strategy: string, token: string) => {
	let profile = null

	if (strategy === 'GITHUB') {
		profile = await axios({
			method: 'get',
			url: `https://api.github.com/user`,
			headers: {
				Authorization: 'token ' + token,
			},
		})
	}

	if (!profile) {
		throw new Error('Profile not found')
	}

	return profile.data
}

/**
 * Authenticates the user using OAuth.
 *
 * @param {any} parent - The parent object.
 * @param {oAuthInput} input - The input object containing the strategy and code.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<object>} The object containing the status, access token, and refresh token.
 */
export const continueWithOAuth = async (strategy: string, code: string) => {
	if (strategy === 'GITHUB') {
		const githubOauth = await axios.get(
			'https://github.com/login/oauth/access_token',
			{
				params: {
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code: code,
				},
				headers: {
					accept: 'application/json',
				},
			}
		)

		if (githubOauth.data.error) {
			throw new GraphQLError('Github oauth error!', {
				extensions: {
					code: 'AUTHENTICATION_ERROR',
				},
			})
		}

		const profile = await getOAuthProfile(
			'GITHUB',
			githubOauth.data.access_token
		)

		let user = await userModel.findOne({ email: profile.email })

		if (!user) {
			user = await userModel.create({
				name: profile.name,
				email: profile.email,
				photo: profile.avatar_url,
				password: '',
				passwordConfirm: '',
				verified: true,
			})
		}

		const { access_token, refresh_token } = await authService.signTokens(user)

		return {
			access_token,
			refresh_token,
		}
	}
}
