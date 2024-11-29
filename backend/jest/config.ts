module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest', // Use ts-jest to transform .ts files
  },
  globals: {
    'ts-jest': {
      isolatedModules: true, // This helps with faster compilation if no type-checking is needed
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transformIgnorePatterns: [
    '/node_modules/(?!supertest|other-modules-to-transform)', // This handles any node_modules that need transformation
  ],
};
