/** @type {import('ts-jest').JestConfigWithTsJest} */
import { resolve, dirname } from 'node:path'; // Import resolve and dirname
import { fileURLToPath } from 'node:url'; // Import fileURLToPath

// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/userManagement/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // --- REMOVE moduleNameMapper ---
  // moduleNameMapper: {
  //   '^(\\.{1,2}/.*)\\.js$': '$1.ts',
  // },
  // --- ADD resolver ---
  resolver: resolve(__dirname, 'jest-resolver.cjs'), // Point to your custom resolver
  // --------------------
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      useESM: true,
    }],
  },
  // Keep transformIgnorePatterns if you had other specific node_modules issues,
  // but for the react-is error, the resolver might make it unnecessary.
  // Let's remove it for now to simplify and see if the resolver is enough.
  transformIgnorePatterns: [
    '/node_modules/', // Default: ignore all node_modules from transformation
  ],
  setupFiles: ['dotenv/config'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};