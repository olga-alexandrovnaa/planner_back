module.exports = {
  apps: [
    {
      name: 'back',
      script: 'dist/main.js',
      time: true,
      out_file: `logs/out.log`,
      error_file: `logs/error.log`,
      combine_logs: true,
      merge_logs: true,
      autorestart: true,
    }
  ],
};
