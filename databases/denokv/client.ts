import { encodeHex } from "@std/encoding";
import { User, UserIn, Account, AccountIn } from "/interfaces.d.ts";
import { DBClient } from "../base.ts";

const client = await Deno.openKv();
export class DenoKVClient extends DBClient {
    #client: Deno.Kv = client;
    #projectName = Deno.env.get("PROJECT_NAME") as string;
    #securityPhrase = Deno.env.get("SECURITY_PHRASE") as string;

    async #generateId(name: string, password: string): Promise<string> {
        const message = `${name}${password}${this.#securityPhrase}`;
        const messageBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);

        const hash = encodeHex(hashBuffer);
        return hash
    }

    async existsUser(name: string, password: string): Promise<boolean> {
        const id = await this.#generateId(name, password);
        return await this.existsUserById(id);
    }

    async existsUserById(id: string): Promise<boolean> {
        const key = [this.#projectName, id];
        const result = await this.#client.get(key);
        return !!result.value;
    }

    async getUserById(id: string): Promise<User> {
        const key = [this.#projectName, id];
        const result = await this.#client.get<User>(key);

        if (!result.value){
            throw new Error("User not found");
        }

        return result.value;
    }

    async getUser(name: string, password: string): Promise<User> {
        const id = await this.#generateId(name, password);

        return await this.getUserById(id);
    }

    async createUser(userIn: UserIn): Promise<User> {
        const id = await this.#generateId(userIn.name, userIn.password);
        const existUser = await this.existsUserById(id);

        if (existUser){
            throw new Error("User already exists");
        }

        const user: User = {
            id,
            name: userIn.name,
            password: userIn.password,
            accounts: []
        };

        const key = [this.#projectName, id];
        const result = await this.#client.set(key, user);
        if (!result.ok) {
            throw new Error("Failed to create user");
        }

        return user;
    }

    async deleteUser(id: string): Promise<User> {
        const existUser = await this.existsUserById(id);
        if (!existUser){
            throw new Error("User not found");
        }

        const user = await this.getUserById(id);

        const key = [this.#projectName, id];
        await this.#client.delete(key);
        return user;
    }

    async updateUser(oldId: string, user: User): Promise<User> {
        const existUser = await this.existsUserById(oldId);
        if (!existUser){
            throw new Error("User not found");
        }

        await this.deleteUser(oldId);

        const id = await this.#generateId(user.name, user.password);
        user.id = id;

        const key = [this.#projectName, id];
        await this.#client.set(key, user);

        return user;
    }

    async getAccount(id: string, accountId: string): Promise<Account> {
        const user = await this.getUserById(id);
        const account = user.accounts.find((a) => a.id === accountId);

        if (!account){
            throw new Error("Account not found");
        }

        return account;
    }

    async addAccount(id: string, accountIn: AccountIn): Promise<Account> {
        const user = await this.getUserById(id);
        const account: Account = {
            id: crypto.randomUUID(),
            service: accountIn.service,
            email: accountIn.email,
            username: accountIn.username,
            password: accountIn.password
        };

        user.accounts.push(account);
        this.#client.set([this.#projectName, id], user);

        return account;
    }

    async removeAccount(id: string, accountId: string): Promise<Account> {
        const user = await this.getUserById(id);
        const index = user.accounts.findIndex((a) => a.id === accountId);
        if (index === -1){
            throw new Error("Account not found");
        }

        const account = user.accounts.splice(index, 1)[0];
        this.#client.set([this.#projectName, id], user);

        return account;
    }

    async updateAccount(id: string, account: Account): Promise<Account> {
        const user = await this.getUserById(id);
        const index = user.accounts.findIndex((a) => a.id === account.id);
        if (index === -1){
            throw new Error("Account not found");
        }

        return account;
    }
}