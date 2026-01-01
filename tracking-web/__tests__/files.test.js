const fs = require('fs')
const path = require('path')

test('api files exist', () => {
  const base = path.join(__dirname, '..')
  const users = path.join(base, 'pages', 'api', 'users.js')
  const loc = path.join(base, 'pages', 'api', 'location.js')
  expect(fs.existsSync(users)).toBe(true)
  expect(fs.existsSync(loc)).toBe(true)
})
