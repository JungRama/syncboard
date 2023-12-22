import { Request } from 'express'
import _ from 'underscore'
import checkAuth from '~/middleware/check-auth'
import { UserAuthFn } from '~/middleware/user-auth'
import fileModel from '~/models/file'
import errorHandler from './error.controller'
import userModel from '~/models/user'
import { GraphQLError } from 'graphql'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import fs from 'fs'

interface FileInputUpdate {
	input: {
		id: string
		name?: string
		thumbnail?: string
		whiteboard?: string
	}
}

interface NewUserAccessInput {
	input: {
		id: string
		user_id: string
		email: string
		role: string
	}
}

interface toogleFavoriteInput {
	input: {
		id: string
	}
}

interface toogleIsPublicInput {
	input: {
		id: string
		value: string
	}
}

const get = async (
	parent: any,
	{ search }: { search: string },
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		const query = {
			'userAccess.userId': user?._id,
		}

		if (search) {
			Object.assign(query, {
				name: { $regex: '.*' + search + '.*', $options: 'i' },
			})
		}

		const files = await fileModel
			.find(query)
			.populate({
				path: 'userAccess.userId',
				model: 'User',
				select: 'name photo email',
			})
			.sort({ updatedAt: -1 })

		return files
	} catch (error) {
		errorHandler(error)
	}
}

const getById = async (
	parent: any,
	{ id, isPublic }: { id: string; isPublic: boolean },
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		let user,
			query = null

		if (!isPublic) {
			user = await checkAuth(req, userAuth)

			query = {
				'userAccess.userId': user?._id,
				_id: id,
			}
		} else {
			query = {
				_id: id,
				isPublic: true,
			}
		}

		const files = await fileModel.findOne(query).populate({
			path: 'userAccess.userId',
			model: 'User',
			select: 'name photo email',
		})

		return files
	} catch (error) {
		errorHandler(error)
	}
}

const getFavorites = async (
	parent: any,
	args: any,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		const query = {
			'userAccess.userId': user?._id,
			'favoriteBy.userId': user?._id,
		}

		const files = await fileModel.find(query).sort({ updatedAt: -1 })

		return files
	} catch (error) {
		errorHandler(error)
	}
}

const toogleFavorite = async (
	parent: any,
	{ input }: toogleFavoriteInput,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		const file = await fileModel.findOne({
			_id: input.id,
			'userAccess.userId': user?._id,
		})

		if (!file) {
			throw new GraphQLError('File not found!', {
				extensions: {
					code: 'VALIDATION',
				},
			})
		}

		const userIndex = file.favoriteBy.findIndex(
			(item) => item.userId.toString() == user?._id.toString()
		)

		if (userIndex > -1) {
			await file.favoriteBy.splice(userIndex, 1)
		} else {
			await file.favoriteBy.push({
				userId: user?._id,
			})
		}

		await file.save()

		return await fileModel.find({
			'userAccess.userId': user?._id,
			'favoriteBy.userId': user?._id,
		})
	} catch (error) {
		errorHandler(error)
	}
}

const toogleIsPublic = async (
	parent: any,
	{ input }: toogleIsPublicInput,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		const file = await fileModel.findOneAndUpdate(
			{
				_id: input.id,
				userAccess: {
					$elemMatch: {
						userId: user._id,
						role: 'OWNER',
					},
				},
			},
			{
				isPublic: input.value,
			},
			{
				new: true,
			}
		)

		console.log(file)

		return file?.isPublic ?? false
	} catch (error) {
		errorHandler(error)
	}
}

const addNewUserAccess = async (
	parent: any,
	{ input }: NewUserAccessInput,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		const selectedUser = await userModel.findOne({
			email: input.email,
		})

		if (!selectedUser) {
			throw new GraphQLError('User not found!', {
				extensions: {
					code: 'VALIDATION',
				},
			})
		}

		const file = await fileModel
			.findOneAndUpdate(
				{
					_id: input.id,
				},
				{
					$push: {
						userAccess: {
							userId: selectedUser?._id,
							role: input.role,
						},
					},
				},
				{
					new: true,
				}
			)
			.populate({
				path: 'userAccess.userId',
				model: 'User',
				select: 'name photo email',
			})

		return file?.userAccess
	} catch (error) {
		errorHandler(error)
	}
}

const changeUserAccess = async (
	parent: any,
	{ input }: NewUserAccessInput,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		let file = null

		if (input.role === 'REMOVE') {
			file = await fileModel.findOneAndUpdate(
				{
					_id: input.id,
				},
				{
					$pull: {
						userAccess: { userId: input.user_id },
					},
				},
				{
					new: true,
				}
			)

			console.log(input.role, input.user_id)
		} else {
			file = await fileModel.findOneAndUpdate(
				{
					_id: input.id,
					'userAccess.userId': input.user_id,
				},
				{
					$set: {
						'userAccess.$.role': input.role,
					},
				},
				{
					new: true,
				}
			)
		}

		await file?.populate({
			path: 'userAccess.userId',
			model: 'User',
			select: 'name photo email',
		})

		return file?.userAccess
	} catch (error) {
		errorHandler(error)
	}
}

const create = async (
	parent: any,
	args: any,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		// Check if the user is authenticated
		const user = await checkAuth(req, userAuth)

		const countFile = await fileModel.countDocuments({
			userAccess: {
				$elemMatch: {
					userId: user._id,
					role: 'OWNER',
				},
			},
		})

		if (countFile >= 3) {
			throw new GraphQLError('For demo purpose you can only have 3 files!', {
				extensions: {
					code: 'VALIDATION',
				},
			})
		}

		const thumbName = crypto.randomUUID()
		const thumbnail = new Identicon(thumbName, 420)
		const dir = 'public/storage/'

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}

		fs.writeFile(
			dir + thumbName + '.png',
			thumbnail.toString(),
			'base64',
			function (err) {
				console.log(err)
			}
		)

		const file = await fileModel.create({
			name: 'Untitled File',
			thumbnail: thumbName + '.png',
			whiteboard: null,
			updatedAt: new Date(),
			userAccess: [
				{
					userId: user?._id,
					role: 'OWNER',
				},
			],
		})

		return file
	} catch (error) {
		errorHandler(error)
	}
}

const update = async (
	parent: any,
	args: FileInputUpdate,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		// Check if the user is authenticated
		await checkAuth(req, userAuth)

		const getInput = _.omit(args.input, _.isNull)

		const file = await fileModel.findByIdAndUpdate(
			args.input.id,
			{
				...getInput,
			},
			{
				new: true,
			}
		)

		return file
	} catch (error) {
		errorHandler(error)
	}
}

const del = () => {}

export default {
	get,
	getById,
	addNewUserAccess,
	changeUserAccess,
	getFavorites,
	toogleFavorite,
	toogleIsPublic,
	create,
	update,
	del,
}
