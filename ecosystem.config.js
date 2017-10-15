module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // App server only
    {
      name: 'app-server',
      script: './dist/index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      watch: [
        './dist/lib/app'
      ],
      out_file: __dirname + '/pm2.log',
      error_file: __dirname + '/pm2-errors.log',
      combine_logs: true
    },
    // with GUI
    {
      name: 'app-server-with-gui',
      script: './dist/cli/chan.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      watch: [
        './dist/lib/app'
      ],
      out_file: __dirname + '/pm2.log',
      error_file: __dirname + '/pm2-errors.log',
      args: "--gui",
      combine_logs: true
    }
  ]
};
