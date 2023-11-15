import { Request } from 'express'
import checkAuth from '~/middleware/check-auth'
import userAuth, { UserAuthFn } from '~/middleware/user-auth'
import fileModel from '~/models/file'
import errorHandler from './error.controller'
import _ from 'underscore'

interface FileInputUpdate {
	input: {
		id: string
		name?: string
		thumbnail?: string
		whiteboard?: string
	}
}

const get = () => {}

const create = async (
	parent: any,
	args: any,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		// Check if the user is authenticated
		await checkAuth(req, userAuth)
		const user = await userAuth(req)
		if (!user) throw new Error('User not found')

		const file = await fileModel.create({
			name: 'Untitled File',
			thumbnail: null,
			whiteboard: null,
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
	create,
	update,
	del,
}
