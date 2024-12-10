// jest.config.cjs
module.exports = {

  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"], // Add TypeScript file extensions
  transformIgnorePatterns: ["/node_modules/"], // Optional: adjust based on your project setup
  module: 'commonjs', // Treat TypeScript files as CommonJS
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/__mocks__/@prisma/client.ts', // Mock path
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  }
};
