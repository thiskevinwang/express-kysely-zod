import type { Config } from 'jest'

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    verbose: true,
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
  }
}
