import { load } from "@std/dotenv";

export const inyectEnvs = async () => {
    if (!Deno.env.has('SECRET')) {
        const env = await load();
        for (const key in env) {
            Deno.env.set(key, env[key]);
        }
    }
}