import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()

dotenv.config()

app.use(express.json())

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))

// Cookie Parser
app.use(cookieParser())

process.on('uncaughtException', (err) => {
	console.error('UNCAUGHT EXCEPTION 🔥 Shutting down...')
	console.error('Error🔥', err.message)
	process.exit(1)
})

export default app
