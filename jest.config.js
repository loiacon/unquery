module.exports = {
  preset: 'ts-jest',
  watchPathIgnorePatterns: ['/node_modules/'],
  rootDir: __dirname,
  testURL: 'https://unquery.com/current-url',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
}
