import { createWSClient, httpBatchLink, loggerLink, wsLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { NextComponentType, NextPageContext } from 'next';
import type { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';

const dev = process.env.NODE_ENV !== 'production';
const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001';

function getEndingLink(ctx: NextPageContext | undefined) {
    if (typeof window === 'undefined') {
        return httpBatchLink({
            url: `${BASE_URL}/api/trpc`,
            headers() {
                if (!ctx?.req?.headers) {
                    return {};
                }
                // on ssr, forward client's headers to the server
                return {
                    ...ctx.req.headers,
                    'x-ssr': '1',
                };
            },
        });
    }
    const client = createWSClient({
        url: dev ? WS_URL : BASE_URL.replace('http', 'ws'),
    });
    return wsLink<AppRouter>({
        client,
    });
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        return {
            /**
             * @link https://trpc.io/docs/data-transformers
             */
            transformer: superjson,
            /**
             * @link https://trpc.io/docs/client/links
             */
            links: [
                // adds pretty logs to your console in development and logs errors in production
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' && opts.result instanceof Error),
                }),
                getEndingLink(ctx),
            ],
            /**
             * @link https://tanstack.com/query/v4/docs/react/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: true,
});

export const withTRPC = <T = {}>(component: NextComponentType<any, any, T>) => {
    return trpc.withTRPC(component) as NextComponentType<any, any, T>;
};

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;