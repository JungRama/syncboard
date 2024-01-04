import { Request } from 'express'
import checkAuth from '~/middleware/check-auth'
import { UserAuthFn } from '~/middleware/user-auth'
import fileModel from '~/models/file'
import filesServices from '~/services/files.services'
import errorHandler from './error.controller'

export interface FileInputUpdate {
	input: {
		id: string
		name?: string
		thumbnail?: string
		whiteboard?: string
	}
}

export interface NewUserAccessInput {
	input: {
		id: string
		user_id: string
		email: string
		role: string
	}
}

export interface toogleFavoriteInput {
	input: {
		id: string
	}
}

export interface toogleIsPublicInput {
	input: {
		id: string
		value: boolean
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

		const files = await filesServices.find(query)

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

		return filesServices.findOne(query)
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

		const file = await filesServices.create(user._id)

		return file
	} catch (error) {
		errorHandler(error)
	}
}

const update = async (
	parent: any,
	{ input }: FileInputUpdate,
	{ req, userAuth }: { req: Request; userAuth: UserAuthFn }
) => {
	try {
		// Check if the user is authenticated
		await checkAuth(req, userAuth)

		const file = await filesServices.update({
			input,
		})

		return file
	} catch (error) {
		errorHandler(error)
	}
}

const del = () => {}

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

		const files = await filesServices.find(query)

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

		filesServices.toogleFavorite(user._id, input.id)

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

		const file = await filesServices.toogleIsPublic(
			user._id,
			input.id,
			input.value
		)

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
		await checkAuth(req, userAuth)

		const file = await filesServices.addNewUserAccess({
			input,
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
		await checkAuth(req, userAuth)

		const file = await filesServices.changeUserAccess({
			input,
		})

		return file?.userAccess
	} catch (error) {
		errorHandler(error)
	}
}

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
