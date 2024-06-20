export declare interface Account {
    id: string;
    service: string;
    email: string;
    username: string;
    password: string;
    phrase?: string;
}

export declare interface AccountIn extends Omit<Account, 'id'> {}


export declare interface User{
    id: string;
    name: string;
    password: string;
    accounts: Account[];
}

export declare interface UserIn extends Omit<User, 'id'> {}
