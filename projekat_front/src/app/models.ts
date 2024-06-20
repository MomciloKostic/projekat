export interface User{
    userId: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    permissions: Array<Permission>;
}

export interface Permission{
    permissionName:  string;
}

export interface Jwt{
    jwt: string;
}
export interface CreateMachine{
    name: string;
}

export interface Machine{
    machineId: number;
    name: string;
    status: string;
    createDate: Date;
    active: string;
}

export interface Status{
    status: string;
}

