export enum UserRole {
    Admin = 'admin',
    User = 'user',
}

export class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly role: 'admin' | 'user';
}

export class UpdateUserDto {
    readonly name?: string;
    readonly email?: string;
    readonly password?: string;
    readonly role?: 'admin' | 'user';
}
