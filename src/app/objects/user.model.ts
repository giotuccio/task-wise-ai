import { UserRole } from "./UserRole";

export interface User {
    id: string;
    name: string;

    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
