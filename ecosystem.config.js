module.exports = {
	apps: [
		{
			name: 'services-syncboard',
			script: 'npm',
			args: 'start',
			cwd: './apps/api',
			watch: true,
			env_production: {
				NODE_ENV: 'production',
				PORT: '4001',
			},
			env_development: {
				NODE_ENV: 'production',
				PORT: '4001',
			},
		},
		{
			name: 'y-websocket-server',
			script: 'npx',
			args: 'y-websocket',
			cwd: './apps/api', // Your script's directory
			watch: true, // Watch for file changes and restart
			env: {
				HOST: 'localhost',
				PORT: 4002,
				// Add other environment variables if needed
			},
		},
	],
}
