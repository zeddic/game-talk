module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    exclude: ['src/index.ts'],
    preprocessors: {
      '**/*.ts': 'karma-typescript',
    },
    karmaTypescriptConfig: {
      reports: {},
      compilerOptions: {
        lib: ['es2017', 'dom'],
        esModuleInterop: 'true',
      },
    },
    reporters: ['dots', 'karma-typescript'],
    browsers: ['ChromeHeadless'],
  });
};
