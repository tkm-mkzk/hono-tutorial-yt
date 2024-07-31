import { Hono } from 'hono'

const app = new Hono()

app.get('/page', (c) => {
  return c.text('You are authorized')
})

export default app
