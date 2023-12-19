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
	{ id }: { id: string },
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		const user = await checkAuth(req, userAuth)

		const query = {
			// 'userAccess.userId': user?._id,
			_id: id,
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

const updateUserAccess = async () => {
	try {
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
	create,
	update,
	del,
}
