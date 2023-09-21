import { publicProcedure, router } from '../trpc';
import projectRouter from './project';
import whitelistRouter from './whitelist';

export const appRouter = router({
    healthcheck: publicProcedure.query(() => 'ok!'),
    project: projectRouter,
    whitelist: whitelistRouter,
});

export type AppRouter = typeof appRouter;