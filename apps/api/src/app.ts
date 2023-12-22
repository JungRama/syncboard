import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { RATE_LIMIT } from './env.config'
import { rateLimit } from 'express-rate-limit'

// Create an instance of the Express application
const app = express()

// Load environment variables from the .env file
dotenv.config()

// Middleware to parse JSON request bodies
app.use(express.json())

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))

// Middleware to parse cookies
app.use(cookieParser())

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Apply rate limiting to limit the number of requests
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		limit: RATE_LIMIT,
		standardHeaders: 'draft-7',
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	})
)

// Handle GET requests to the root URL '/'
app.get('/', (req, res) => {
	res.send('Welcome to "Collaborative Whiteboard"!')
})

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('UNCAUGHT EXCEPTION 🔥 Shutting down...')
	console.error('Error🔥', err.message)
	process.exit(1)
})

export default app
