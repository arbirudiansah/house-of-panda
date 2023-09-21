import * as db from '@/lib/Database';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { IncomingMessage } from 'http';
import ws from 'ws';
import { middleware } from './trpc';
import { TRPCError } from '@trpc/server';
import { decryptPrivateKey } from '@/lib/utils/crypto';
import { createProvider, BlackRoof } from '@/lib/web3/BlackRoof';
import { User } from '@/lib/types/User';
import Web3 from 'web3';
import Redis from 'ioredis';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { getCookies } from 'cookies-next';

export const isAdmin = middleware(async ({ ctx: { req }, next }) => {
    const cookies = getCookies({ req });
    if (!cookies['adminToken']) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized to access this resource' });
    }

    return next();
});

export const isUser = middleware(async ({ ctx, next }) => {
    const cookies = getCookies({ req: ctx.req });
    if (!cookies['token']) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized to access this resource' });
    }

    if (cookies['user']) {
        ctx.user = JSON.parse(cookies['user'])
    }

    return next({ ctx });
});

const web3 = createProvider()
const signer = () => {
    const privateKey = decryptPrivateKey(process.env.ADMIN_KEY!, process.env.PASSWORD!)
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    return account
}

const blackRoof = new BlackRoof(web3, signer())

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
    opts:
        | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
        | trpcNext.CreateNextContextOptions,
): Promise<{
    req: IncomingMessage | NextApiRequest;
    res: ws | NextApiResponse;
    redis: Redis;
    blackRoof: BlackRoof;
    web3: Web3;
    user?: User;
}> => {
    await db.createConnection()
    const redis = await db.createRedisConnection();

    return {
        req: opts.req,
        res: opts.res,
        redis,
        blackRoof,
        web3,
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;