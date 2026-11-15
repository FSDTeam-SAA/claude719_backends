module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: __dirname,
      script: 'dist/server.js',
      interpreter: process.execPath,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      env: { NODE_ENV: 'production' },
    },
  ],
};
