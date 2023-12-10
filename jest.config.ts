import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
const {
  compilerOptions: { paths, baseUrl },
} = require('./tsconfig');

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  // rootDir: 'src',
  testEnvironment: 'node',
  // testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // collectCoverageFrom: ['**/*.(t|j)s'],
  // coverageDirectory: '../coverage',

  modulePaths: [baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(paths),
};

export default config;
