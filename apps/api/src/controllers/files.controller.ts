import { Request } from 'express'
import _ from 'underscore'
import checkAuth from '~/middleware/check-auth'
import { UserAuthFn } from '~/middleware/user-auth'
import fileModel from '~/models/file'
import errorHandler from './error.controller'

interface FileInputUpdate {
	input: {
		id: string
		name?: string
		thumbnail?: string
		whiteboard?: string
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
				name: { $regex: '.*' + search + '.*' },
			})
		}

		const files = await fileModel.find(query).populate({
			path: 'userAccess.userId',
			model: 'User',
			select: 'name photo',
		})

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
			select: 'name photo',
		})

		return files
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

		// const user = await userAuth(req)
		// if (!user) throw new Error('User not found')

		const file = await fileModel.create({
			name: 'Untitled File',
			thumbnail: null,
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
		const user = await userAuth(req)
		if (!user) throw new Error('User not found')

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
	create,
	update,
	del,
}
