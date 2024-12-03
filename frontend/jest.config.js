module.exports = {
    transform: {
      "^.+\\.tsx?$": "ts-jest",  // Transform TypeScript files using ts-jest
    },
    testEnvironment: "node",  // Set the test environment to Node.js
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"], // Add support for TypeScript and JavaScript
  };
  