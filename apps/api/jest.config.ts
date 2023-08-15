import type { Config } from 'jest'

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    verbose: true,
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    reporters: ['default', 'jest-junit'],
    prettierPath: null, // Disable prettier; Prettier 3 is not supported
  }
}
