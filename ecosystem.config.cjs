// PM2 ecosystem config for Knowledge Scout API
// Uses PM2's env_file option to load environment variables from ./api/.env
// and runs the built entry at api/dist/index.mjs
// Usage examples (from repo root):
//   npx pm2 start ecosystem.config.cjs --only knowledgescout-api
//   npx pm2 stop ecosystem.config.cjs --only knowledgescout-api

const path = require('path');

module.exports = {
    apps: [
        {
            name: 'knowledgescout-api',
            // run the built ESM bundle with node
            script: 'dist/index.mjs',
            cwd: path.resolve(__dirname, 'api'),
            interpreter: 'node',
            // let PM2 load env vars from this file
            env_file: path.resolve(__dirname, 'api', '.env'),
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            max_restarts: 10,
            watch: false,
            // logs are relative to cwd (api/)
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm Z'
        }
    ]
};
