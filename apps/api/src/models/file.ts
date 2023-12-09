import mongoose, { Document, Schema } from 'mongoose'

// Define the File interface
export interface IFile extends Document {
	name: string
	thumbnail?: string
	whiteboard: string
	userAccess: {
		userId: string
		role: string
	}[]
	createdAt: Date
	updatedAt: Date
}

// Define the user schema
const fileSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: String,
			required: false,
		},
		whiteboard: {
			type: String,
			required: false,
		},
		userAccess: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				role: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Create the file model
const fileModel = mongoose.model<IFile>('File', fileSchema)
export default fileModel
