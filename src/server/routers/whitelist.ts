import EventEmitter from "events";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { errorHandler } from "@/lib/ErrorHandler";
import { isAdmin, isUser } from "../context";
import whitelistRepo from "@/lib/repository/WhitelistRepository";
import { observable } from "@trpc/server/observable";
import { MintStateValue } from "@/lib/types/Payload";
import Project from "@/lib/models/Project";

interface MintPayload {
    state: MintStateValue
    trxHash?: string
    error?: string
}

interface MyEvents {
    SettingsChanged: () => void;
}

declare interface MyEventEmitter {
    on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
    off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
    once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
    emit<TEv extends keyof MyEvents>(
        event: TEv,
        ...args: Parameters<MyEvents[TEv]>
    ): boolean;
}

class MyEventEmitter extends EventEmitter { }

const ev = new MyEventEmitter()

const whitelistRouter = router({
    setSetting: publicProcedure
        .use(isAdmin)
        .input(z.object({
            start: z.number(),
            end: z.number(),
        }))
        .mutation(async ({ input, ctx: { redis } }) => {
            try {
                await whitelistRepo.setSetting(redis, input);

                ev.emit('SettingsChanged');

                return true;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    addAddresses: publicProcedure
        .use(isAdmin)
        .input(z.object({
            addresses: z.array(z.string()),
        }))
        .mutation(async ({ input, ctx: { redis } }) => {
            try {
                await whitelistRepo.addAddresses(redis, input.addresses);

                ev.emit('SettingsChanged');

                return true;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    updateAddress: publicProcedure
        .use(isAdmin)
        .input(z.object({
            oldAddress: z.string(),
            newAddress: z.string(),
        }))
        .mutation(async ({ input, ctx: { redis } }) => {
            try {
                await whitelistRepo.updateAddress(redis, input.oldAddress, input.newAddress);

                ev.emit('SettingsChanged');

                return true;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    removeAddresses: publicProcedure
        .use(isAdmin)
        .input(z.object({
            addresses: z.array(z.string()),
            erase: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx: { redis } }) => {
            try {
                if (input.erase) {
                    await whitelistRepo.clearAddresses(redis);
                } else {
                    await whitelistRepo.removeAddresses(redis, input.addresses);
                }

                ev.emit('SettingsChanged');

                return true;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    getSetting: publicProcedure
        .input(z.object({}))
        .query(async ({ ctx: { redis } }) => {
            try {
                const setting = await whitelistRepo.getSetting(redis);
                if (!setting) return null;

                return setting;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    getAddresses: publicProcedure
        .use(isAdmin)
        .input(z.object({
            address: z.string().optional(),
        }))
        .query(async ({ input, ctx: { redis } }) => {
            try {
                const addresses = await whitelistRepo.getAddresses(redis, input.address);

                return addresses;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    onSettingsChanged: publicProcedure
        .use(isAdmin)
        .subscription(() => {
            return observable<void>((emit) => {
                const settingsChanged = async () => {
                    emit.next()
                };

                ev.on('SettingsChanged', settingsChanged);

                return () => {
                    ev.off('SettingsChanged', settingsChanged);
                };
            });
        }),
    getAdminSignature: publicProcedure
        .use(isUser)
        .input(z.object({
            project: z.string(),
            amount: z.number(),
            from: z.string(),
            to: z.string(),
        }))
        .mutation(async ({ input, ctx: { blackRoof, user } }) => {
            try {
                const project = await Project.findById(input.project)
                if (!project) throw new Error('Project not found')
                if (!user) throw new Error('Unauthorized')

                const { projectId } = project.toObject().onchainData

                const signature = blackRoof.getAdminSignature(projectId, input.amount, input.from, input.to);

                return signature;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
})

export default whitelistRouter;