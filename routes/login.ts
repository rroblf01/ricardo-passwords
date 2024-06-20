import { Hono, Context } from "@hono/hono";

import { validator } from "@hono/hono/validator";
import { sign } from '@hono/hono/jwt'

import { validatorLoginUserIn, validatorRegisterUserIn } from '/routes/validators.ts'
import { DenoKVClient } from "/databases/denokv/client.ts"
import { getTimestamp } from '/routes/utils.ts'

export const loginRoutes = new Hono()

loginRoutes.post('/login', validator('json', validatorLoginUserIn), async (c: Context) => {
    const {user} = c.req.valid('json')

    const payload = {
      id: user.id,
      exp: getTimestamp(20),
    }
    const secret = Deno.env.get('SECRET') as string
    const token = await sign(payload, secret)
    return c.json({ token })
})

loginRoutes.post('/register', validator('json', validatorRegisterUserIn), async (c: Context) => {
    const client = new DenoKVClient()
    const { name, password } = c.req.valid('json')
    try {
        
      const user = await client.createUser({ name, password })
      const payload = {
        id: user.id,
        exp: getTimestamp(20),
      }
      const secret = Deno.env.get('SECRET') as string
      const token = await sign(payload, secret)
      return c.json({ token })
    } catch (error) {
      return c.json({ error: error.message }, 400)
    }
})