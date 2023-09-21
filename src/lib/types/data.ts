import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    error?: string | null;
    result?: any;
};

type User = {
    id: string;
    fullName: string;
    address: string;
    active: boolean;
    nonce: number;
}

export enum AdminRole {
    admin = 'Admin',
    superAdmin = 'SuperAdmin',
}

export interface ResultEntries<T> {
    entries: T[];
    count: number;
}

export interface QueryString {
    limit?: number;
    offset?: number;
    query?: string;
    status?: string;
    sort?: any;
    inRange?: string;
};

export interface DataFilter {
    perPage?: number;
    page?: number;
    query?: string;
    status?: string;
    sort?: any;
    inRange?: string;
};

export type KeyValue<T> = { [key: string]: T }
export type KeyValueString = { [key: string]: string }

export interface NextApiRequestWithUser extends NextApiRequest {
    user: User;
    admin: User;
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

interface ToType<T> {
    body: T;
    query: T;
}

export type NextApiRequestV2<T> = Override<NextApiRequest, ToType<T>>;
export type NextApiResponseV2 = NextApiResponse<Data>;

export default Data;