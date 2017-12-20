module.exports = {
  apps: [{
    name: 'tutorial-2',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-54-254-201-249.ap-southeast-1.compute.amazonaws.com',
      key: '~/.ssh/navaz.pem',
      ref: 'origin/master',
      repo: 'https://github.com/navaz059/tutorial-pt-2.git',
      path: '/home/ubuntu/tutorial-2',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}