/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only prod
 *  development mode :: pm2 start ecosystem.config.js --only dev
 */
 module.exports = {
  apps: [
    {
      name: 'uacl', // pm2 start App name
      script: 'dist/index.js',
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ['node_modules', 'logs'], // ignore files change
      max_memory_restart: '1G', // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: './logs/access.log', // pm2 log file
      error: './logs/error.log', // pm2 error log file
      env_test: {
        PORT: 7001,
        NODE_ENV: 'test',
        DOMAIN: 'http://lobalhost:9000',
        DB_HOST: "",
        DB_PORT: 3306,
        DB_USER: "",
        DB_PASSWORD: "",
        DB_DATABASE: ""
      },
      env_production: {
        PORT: 9000,
        NODE_ENV: 'production',
        DOMAIN: 'http://150.158.119.41:9000',
        DB_HOST: "150.158.119.41",
        DB_PORT: 3306,
        DB_USER: "root",
        DB_PASSWORD: "mysql123456",
        DB_DATABASE: "uacl"
      }
    }
  ]
};
