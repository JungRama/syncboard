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
			name: 'ws-services-syncboard',
			script: 'npx',
			args: 'HOST=localhost PORT=4002 npx y-websocket',
			cwd: './apps/api',
		},
	],
}
