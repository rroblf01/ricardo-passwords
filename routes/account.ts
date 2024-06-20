import { Hono } from "@hono/hono";
import { validator } from "@hono/hono/validator";

import { DenoKVClient } from "/databases/denokv/client.ts"
import { validatorAccountIn, validatorAccountDecryptIn } from "/routes/validators.ts"
import { AccountIn } from "/interfaces.d.ts";
import { encrypt, decrypt } from "./utils.ts";

export const accountRoutes = new Hono()

accountRoutes.post('/:accountId/decrypt', validator('json', validatorAccountDecryptIn), async (c) => {
    const {id} = c.get('jwtPayload')
    const {phrase} = c.req.valid('json')
    const { accountId } = c.req.param()
    try{
        const client = new DenoKVClient()
        const account = await client.getAccount(id, accountId)
        account.password = await decrypt(account.password, phrase)
        
        return c.json(account)
    } catch (error) {
        return c.json({ error: error.message }, 400)
    }
})

accountRoutes.post('/', validator('json', validatorAccountIn), async (c) => {
    const {service, email, username, password, phrase} = c.req.valid('json')
    const accountIn: AccountIn = {service, email, username, password}
    accountIn.password = await encrypt(accountIn.password, phrase)

    const {id} = c.get('jwtPayload')

    try{
        const client = new DenoKVClient()
        const user = await client.addAccount(id, accountIn)
        return c.json(user)
    } catch (error) {
        return c.json({ error: error.message }, 400)
    }
})

accountRoutes.delete('/:accountId', async (c) => {
    const client = new DenoKVClient()
    const {id} = c.get('jwtPayload')
    const { accountId } = c.req.param()
    try{
        const user = await client.removeAccount(id, accountId)
        return c.json(user)
    } catch (error) {
        return c.json({ error: error.message }, 400)
    }
})