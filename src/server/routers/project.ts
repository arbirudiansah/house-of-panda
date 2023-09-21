/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { EventEmitter } from 'events';
import Project from '../../lib/models/Project';
import { errorHandler } from '../../lib/ErrorHandler';
import { observable } from '@trpc/server/observable';
import * as projectRepo from "@/lib/repository/ProjectRepository";
import { ProjectPayloadSchema, SetProjectStatusSchema } from '@/lib/types/Project';
import { z } from 'zod';
import { ProjectQuery } from '@/lib/types/Payload';
import { isAdmin } from '../context';

interface ProjectDeployStatus {
    trxHash?: string;
    error?: string;
    status: 'pending' | 'deploying' | 'success' | 'failed';
}

interface MyEvents {
    DeployProject: (data: ProjectDeployStatus) => void;
    ProjectsWhitelisted: (count: number) => void;
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

const projectRouter = router({
    createProject: publicProcedure
        .use(isAdmin)
        .input(ProjectPayloadSchema)
        .mutation(async ({ input, ctx: { blackRoof, web3 } }) => {
            try {
                const payload = { ...input }
                const projectId = await blackRoof.nextProjectIndex();
                payload.onchainData.projectId = projectId

                const project = await projectRepo.createProject(payload);
                if (!project) {
                    throw new Error('Project creation failed');
                }

                const { onchainData, name, timeline } = project.toObject()

                const data = {
                    ...onchainData,
                    title: name,
                    startTime: new Date(timeline.funding_start),
                    endTime: new Date(timeline.funding_end),
                }

                await blackRoof.createProject(data, {
                    onTransactionHash: async (trxHash) => {
                        console.log("🚀 ~ file: project.ts:66 ~ onTransactionHash: ~ trxHash:", trxHash)
                        await projectRepo.setProjectDeployStatus({ projectId, trxHash, web3 })
                        ev.emit("DeployProject", { trxHash, status: 'deploying' });
                    },
                    onReceipt: async (trxHash) => {
                        console.log("🚀 ~ file: project.ts:71 ~ onReceipt: ~ trxHash:", trxHash)
                        await projectRepo.setProjectDeployStatus({ projectId, trxHash, web3 })
                        ev.emit("DeployProject", { trxHash, status: 'success' });
                    },
                    onError: async (error) => {
                        console.log("🚀 ~ file: project.ts:76 ~ onError: ~ error:", error)
                        await projectRepo.setProjectDeployStatus({ projectId, web3 })
                        ev.emit("DeployProject", { status: 'failed', error });
                    },
                })

                return project.toObject();
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    redeployProject: publicProcedure
        .use(isAdmin)
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx: { blackRoof, web3 } }) => {
            try {
                const newProjectId = await blackRoof.nextProjectIndex();
                const project = await Project.findById(input.id)
                if (!project) {
                    throw new Error('Failed recreating project');
                }

                project.onchainData.status = 'creating'
                await project.save()

                const { onchainData, name, timeline } = project.toObject()
                const currProjectId = onchainData.projectId

                const data = {
                    ...onchainData,
                    title: name,
                    startTime: new Date(timeline.funding_start),
                    endTime: new Date(timeline.funding_end),
                }

                await blackRoof.createProject(data, {
                    onTransactionHash: async (trxHash) => {
                        console.log("🚀 ~ file: project.ts:102 ~ onTransactionHash: ~ trxHash:", trxHash)
                        await projectRepo.setProjectDeployStatus({ projectId: currProjectId, trxHash, newProjectId, web3 })
                        ev.emit("DeployProject", { trxHash, status: 'deploying' });
                    },
                    onReceipt: async (trxHash) => {
                        console.log("🚀 ~ file: project.ts:107 ~ onReceipt: ~ trxHash:", trxHash)
                        await projectRepo.setProjectDeployStatus({ projectId: newProjectId ?? currProjectId, trxHash, web3 })
                        ev.emit("DeployProject", { trxHash, status: 'success' });
                    },
                    onError: async (error) => {
                        console.log("🚀 ~ file: project.ts:112 ~ onError: ~ error:", error)
                        await projectRepo.setProjectDeployStatus({ projectId: currProjectId, web3 })
                        ev.emit("DeployProject", { status: 'failed', error });
                    },
                })

                return project.toObject();
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    onDeployProject: publicProcedure
        .use(isAdmin)
        .subscription(() => {
            return observable<ProjectDeployStatus>((emit) => {
                const deployProject = async (data: ProjectDeployStatus) => {
                    emit.next(data)
                };

                ev.on('DeployProject', deployProject);

                return () => {
                    ev.off('DeployProject', deployProject);
                };
            });
        }),
    setStatus: publicProcedure
        .use(isAdmin)
        .input(SetProjectStatusSchema)
        .mutation(async ({ input, ctx: { blackRoof } }) => {
            try {
                const { id, status } = input

                const { onchainData } = await Project.findByIdAndUpdate(id, {
                    status,
                    active: status === "0x01"
                })
                const txHash = await blackRoof.setProjectStatus(onchainData.projectId, status)

                return txHash
            } catch (error: any) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    setWhitelist: publicProcedure
        .use(isAdmin)
        .input(z.object({ ids: z.string().array(), whitelisted: z.boolean() }))
        .mutation(async ({ input }) => {
            try {
                const { ids, whitelisted } = input
                const params = { active: true, whitelisted: !whitelisted }

                let count = 0
                if (ids.length === 0) {
                    const projects = await Project.updateMany(params, { whitelisted })
                    count = projects.modifiedCount
                } else {
                    const projects = await Project.updateMany({ _id: { $in: ids }, ...params }, {
                        whitelisted
                    })
                    count = projects.modifiedCount
                }

                ev.emit("ProjectsWhitelisted", count);

                return count
            } catch (error: any) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    onProjectsWhitelisted: publicProcedure
        .use(isAdmin)
        .subscription(() => {
            return observable<number>((emit) => {
                const whitelistProject = async (count: number) => {
                    emit.next(count)
                };

                ev.on('ProjectsWhitelisted', whitelistProject);

                return () => {
                    ev.off('ProjectsWhitelisted', whitelistProject);
                };
            });
        }),
    isAllWhitelisted: publicProcedure
        .use(isAdmin)
        .query(async () => {
            try {
                const activeProjectsCount = await Project.countDocuments({ active: true })
                const count = await Project.countDocuments({ active: true, whitelisted: true })
                return count === activeProjectsCount
            } catch (error: any) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
    list: publicProcedure
        .use(isAdmin)
        .input(z.object({
            limit: z.any().transform((val) => Number(val)),
            offset: z.any().transform((val) => Number(val)),
            keyword: z.string().optional(),
            sort: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            activeProjectOnly: z.boolean().optional().default(false),
            whitelisted: z.string().optional().transform((val) => val === '1'),
        }))
        .query(async ({ input }) => {
            try {
                const query: ProjectQuery = {
                    limit: input.limit,
                    offset: input.offset,
                    keyword: input.keyword,
                    sort: input.sort,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    active: input.activeProjectOnly,
                    whitelisted: input.whitelisted,
                };

                const result = await projectRepo.getProjectList(query)
                return result;
            } catch (error: any) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: errorHandler(error),
                })
            }
        }),
});

export default projectRouter;