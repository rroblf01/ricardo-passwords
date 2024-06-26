import { Hono } from "@hono/hono";
import { cors } from '@hono/hono/cors'
import { jwt } from '@hono/hono/jwt'
import type { JwtVariables } from '@hono/hono/jwt'
import {inyectEnvs} from '/envs.ts'
import { loginRoutes } from "./routes/login.ts";
import { userRoutes } from "./routes/user.ts";
import { accountRoutes } from "./routes/account.ts";

await inyectEnvs()

type Variables = JwtVariables
const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
  origin: [Deno.env.get('ORIGIN') as string],
}))
app.use(
  '/api/*', 
  jwt({
    secret: Deno.env.get('SECRET') as string,
    cookie: 'Authorization',
    alg: 'HS256'
  })
)

app.get('/healthcheck', (c) => c.json({ status: 'ok' }))
app.route('/api/user', userRoutes)
app.route('/api/account', accountRoutes)
app.route('/', loginRoutes)

Deno.serve(app.fetch)