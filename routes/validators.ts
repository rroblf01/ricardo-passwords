import { UserIn, AccountIn } from "/interfaces.d.ts"
import { Context } from "@hono/hono"
import { DenoKVClient } from "/databases/denokv/client.ts"


export const validatorLoginUserIn = async (value: UserIn, c: Context) => {

    console.log(value)
    try{
        if(!value.name || !value.password) throw new Error('Invalid user')
        const client = new DenoKVClient()

        const user = await client.getUser(value.name, value.password)
        return {user}

    } catch (error) {
        return c.json({ error: error.message }, 404)
    }
}

export const validatorRegisterUserIn = async (value: UserIn, c: Context) => {
    try{
        if(!value.name || !value.password) throw new Error('Invalid user')
        const client = new DenoKVClient()

        const exists = await client.existsUser(value.name, value.password)
        if(exists) throw new Error('User already exists')
        return {name: value.name, password: value.password}
    } catch (error) {
        return c.json({ error: error.message }, 400)
    }
}

export const validatorAccountIn = (value: AccountIn, c: Context) => {
    try{
        if(!value.service || !value.email || !value.username || !value.password || !value.phrase) throw new Error('Invalid account')
        const {service, email, username, password, phrase} = value
        return {service, email, username, password, phrase}

    } catch (error) {
        return c.json({ error: error.message }, 404)
    }
}

export const validatorAccountDecryptIn = (value: {phrase: string}, c: Context) => {
    try{
        if(!value.phrase) throw new Error('Phrase is required')
        
        return {phrase: value.phrase}

    } catch (error) {
        return c.json({ error: error.message }, 404)
    }
}