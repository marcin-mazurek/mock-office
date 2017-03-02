module.exports = wallaby => ({
  files: [
    'src/**/*.js',
    '!src/**/*.story.js',
    '!src/**/*.test.js',
    'package.json',
  ],
  tests: ['src/**/*.test.js'],
  env: {
    type: 'node',
    runner: 'node'
  },
  testFramework: 'jest',
  preprocessors: {
    'src/**/*.js': wallaby.compilers.babel({}),
  }
});
