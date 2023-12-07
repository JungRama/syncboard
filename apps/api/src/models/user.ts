import mongoose, { Document, Schema } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

// Define the User interface
export interface IUser extends Document {
	name: string
	email: string
	password?: string
	passwordConfirm?: string | undefined
	role?: string
	verified: boolean
	comparePasswords: (
		candidatePassword: string,
		hashedPassword: string
	) => Promise<boolean>
}

// Define the user schema
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
			lowercase: true,
		},
		password: {
			type: String,
			required: false,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [false, 'Please confirm your password'],
			validate: {
				validator: function (this: IUser, val: string) {
					return val === this.password
				},
				message: 'Passwords do not match',
			},
		},
		role: {
			type: String,
			default: 'user',
		},
		verified: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Add an index to the email field
userSchema.index({ email: 1 })

// Pre-save hook to hash the password
userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) return next()

	this.password = await bcrypt.hash(this.password ?? '', 12)

	this.passwordConfirm = undefined
	next()
})

// Method to compare passwords
userSchema.methods.comparePasswords = async function (
	this: IUser,
	candidatePassword: string,
	hashedPassword: string
) {
	return await bcrypt.compare(candidatePassword, hashedPassword)
}

// Create the user model
const userModel = mongoose.model<IUser>('User', userSchema)
export default userModel
