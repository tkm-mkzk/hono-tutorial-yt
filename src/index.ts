import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

type BlogPost = {
  id: number
  title: string
  content: string
}

let blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Blog1',
    content: 'Bog1 Posts',
  },
  {
    id: 2,
    title: 'Blog2',
    content: 'Bog2 Posts',
  },
  {
    id: 3,
    title: 'Blog3',
    content: 'Bog3 Posts',
  },
]
app.use('*', prettyJSON())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/posts', (c) => c.json({ posts: blogPosts }))

app.get('posts/:id', (c) => {
  const id: number = Number(c.req.param('id'))
  const post: BlogPost | undefined = blogPosts.find((p) => p.id === id)

  if (post) {
    return c.json(post)
  } else {
    return c.json({ message: 'Post not found' }, 404)
  }
})

app.post('/posts', async (c) => {
  const { title, content } = await c.req.json<{ title: string; content: string }>()
  const newPost = { id: blogPosts.length + 1, title, content }
  blogPosts = [...blogPosts, newPost]
  return c.json(newPost, 201)
})

app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const index = blogPosts.findIndex((p) => p.id === Number(id))

  if (index === -1) {
    return c.json({ message: 'Post not found' }, 404)
  }

  const { title, content } = await c.req.json()
  blogPosts[index] = { ...blogPosts[index], title, content }

  return c.json(blogPosts[index])
})

app.delete('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const index = blogPosts.findIndex((p) => p.id === Number(id))

  if (index === -1) {
    return c.json({ message: 'Post not found' }, 404)
  }

  blogPosts = blogPosts.filter((p) => p.id !== Number(id))

  return c.json({ message: 'Blog post deleted' })
})

export default app
