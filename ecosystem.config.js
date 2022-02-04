module.exports = {
  apps: [{
    name: 'portfolio',
    cwd: './',
    script: 'server/index.js',
    env: {
      PROTOCOL: 'https',
    },
  }]
}
