import app from './server/api/index.js'
import http from 'http'
import fetch from 'node-fetch'

const server = http.createServer(app)
server.listen(3009, async () => {
  console.log('started test server on 3009')
  const urls = ['http://localhost:3009/auth/login', 'http://localhost:3009/api/auth/login']
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'x', password: 'x' }),
      })
      console.log(url, res.status, await res.text())
    } catch (error) {
      console.log(url, 'ERROR', error.message)
    }
  }
  server.close(() => process.exit(0))
})
