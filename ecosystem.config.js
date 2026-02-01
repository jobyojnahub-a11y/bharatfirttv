module.exports = {
  apps: [{
    name: 'bharatfirsttv',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bharatfirsttv',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}