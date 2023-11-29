import http from 'http'
import express from 'express'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import typeDefs from './schemas/index'
import { Mutation, Query } from './resolvers/index'

import cors from 'cors'
import connectDB from '~/core/mongoose'

import app from './app'
import userAuth, { UserAuthFn } from '~/middleware/user-auth'

import { PORT } from '~/env.config'

// Create an HTTP server using Express
const httpServer = http.createServer(app)

// Define CORS options
const corsOptions = {
	origin: [
		'https://studio.apollographql.com',
		`http://localhost:${PORT}`,
		`http://localhost:3000`,
	],
	credentials: true,
}

// Apply CORS and JSON middleware to the Express app
app.use(cors(corsOptions))
app.use(express.json())

// Define GraphQL resolvers
const resolvers = {
	Query,
	Mutation,
}

// Define the context type for Apollo Server
type Context = {
	req: express.Request
	res: express.Response
	userAuth: UserAuthFn
}

// Start the server
;(async function () {
	// Create an Apollo Server instance
	const server = new ApolloServer<Context>({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	})

	// Connect to the database
	await connectDB()

	// Start the Apollo Server
	await server.start()

	app.get('/', (req, res) => {
		res.send('Welcome to "Collaborative Whiteboard"!')
	})

	// Apply the Apollo Server middleware to the Express app
	app.use(
		'/graphql',
		cors<cors.CorsRequest>(),
		express.json(),
		expressMiddleware(server, {
			context: async ({
				req,
				res,
			}: {
				req: express.Request
				res: express.Response
			}): Promise<Context> => {
				return { req, res, userAuth }
			},
		})
	)

	// Start the HTTP server
	await new Promise<void>((resolve) =>
		httpServer.listen({ port: PORT }, resolve)
	)

	// Log the server URL
	console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
})()

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION 🔥🔥 Shutting down...')
	console.error('Error🔥', (err as Error).message)

	// Close the HTTP server
	httpServer.close(async () => {
		process.exit(1)
	})
})
