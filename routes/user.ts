import { Hono } from "@hono/hono";
import { DenoKVClient } from "/databases/denokv/client.ts"

export const userRoutes = new Hono()

userRoutes.get('/', async (c) => {
    const client = new DenoKVClient()
    const {id} = c.get('jwtPayload')
    const user = await client.getUserById(id)
    return c.json(user)
})

userRoutes.delete('/', async (c) => {
    const client = new DenoKVClient()
    const {id} = c.get('jwtPayload')
    const user = await client.deleteUser(id)
    return c.json(user)
})
