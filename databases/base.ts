import { User, UserIn, Account, AccountIn } from "../interfaces.d.ts";

export class DBClient {
    async existsUserById(id: string): Promise<boolean> {
        throw new Error("Not implemented");
    }

    async existsUser(name: string, password: string): Promise<boolean> {
        throw new Error("Not implemented");
    }

    async getUserById(id: string): Promise<User> {
        throw new Error("Not implemented");
    }

    async getUser(name: string, password: string): Promise<User> {
        throw new Error("Not implemented");
    }

    async createUser(userIn: UserIn): Promise<User> {
        throw new Error("Not implemented");
    }

    async deleteUser(id: string): Promise<User> {
        throw new Error("Not implemented");
    }

    async updateUser(oldId: string, user: User): Promise<User> {
        throw new Error("Not implemented");
    }

    async getAccount(id: string, accountId: string): Promise<Account> { 
        throw new Error("Not implemented");
    }

    async addAccount(id: string, accountIn: AccountIn): Promise<Account> {
        throw new Error("Not implemented");
    }

    async removeAccount(id: string, accountId: string): Promise<Account> {
        throw new Error("Not implemented");
    }

    async updateAccount(id: string, account: Account): Promise<Account> {
        throw new Error("Not implemented");
    }
}