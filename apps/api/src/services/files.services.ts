import crypto from 'crypto'
import fs from 'fs'
import { GraphQLError } from 'graphql'
import Identicon from 'identicon.js'
import { RootQuerySelector } from 'mongoose'
import _ from 'underscore'
import {
	FileInputUpdate,
	NewUserAccessInput,
} from '~/controllers/files.controller'
import fileModel, { IFile } from '~/models/file'
import userModel from '~/models/user'

const find = async (query: RootQuerySelector<IFile> & Partial<IFile>) => {
	const files = await fileModel
		.find(query)
		.populate({
			path: 'userAccess.userId',
			model: 'User',
			select: 'name photo email',
		})
		.sort({ updatedAt: -1 })

	return files
}

const findOne = async (query: RootQuerySelector<IFile> & Partial<IFile>) => {
	const files = await fileModel.findOne(query).populate({
		path: 'userAccess.userId',
		model: 'User',
		select: 'name photo email',
	})

	return files
}

const create = async (userId: string) => {
	const countFile = await fileModel.countDocuments({
		userAccess: {
			$elemMatch: {
				userId: userId,
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
				userId: userId,
				role: 'OWNER',
			},
		],
	})
}

const update = async ({ input }: FileInputUpdate) => {
	const getInput = _.omit(input, _.isNull)

	const file = await fileModel.findByIdAndUpdate(
		input.id,
		{
			...getInput,
		},
		{
			new: true,
		}
	)
}

const toogleFavorite = async (userId: string, id: string) => {
	const file = await fileModel.findOne({
		_id: id,
		'userAccess.userId': userId,
	})

	if (!file) {
		throw new GraphQLError('File not found!', {
			extensions: {
				code: 'VALIDATION',
			},
		})
	}

	const userIndex = file.favoriteBy.findIndex(
		(item) => item.userId.toString() == userId.toString()
	)

	if (userIndex > -1) {
		await file.favoriteBy.splice(userIndex, 1)
	} else {
		await file.favoriteBy.push({
			userId: userId,
		})
	}

	await file.save()
}

const addNewUserAccess = async ({ input }: NewUserAccessInput) => {
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

	return file
}

const changeUserAccess = async ({ input }: NewUserAccessInput) => {
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

	return await file?.populate({
		path: 'userAccess.userId',
		model: 'User',
		select: 'name photo email',
	})
}

const toogleIsPublic = async (userId: string, id: string, value: boolean) => {
	const file = await fileModel.findOneAndUpdate(
		{
			_id: id,
			userAccess: {
				$elemMatch: {
					userId: userId,
					role: 'OWNER',
				},
			},
		},
		{
			isPublic: value,
		},
		{
			new: true,
		}
	)

	return file
}

export default {
	find,
	findOne,
	create,
	update,
	toogleFavorite,
	addNewUserAccess,
	changeUserAccess,
	toogleIsPublic,
}
