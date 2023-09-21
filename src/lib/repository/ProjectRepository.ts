import IProject, { ProjectPayload } from "@/lib/types/Project";
import Project from "@/lib/models/Project";
import mongoose, { HydratedDocument } from "mongoose";
import { ProjectQuery } from "@/lib/types/Payload";
import { ResultEntries } from "../types/data";
import moment from "moment";
import Web3 from "web3";

export const createProject = async (payload: ProjectPayload) => {
    const project: HydratedDocument<IProject> = new Project({ ...payload })
    await project.save();

    return project;
}

export const getProjectList = async (params: ProjectQuery): Promise<ResultEntries<IProject>> => {
    let filter: any = {}

    if (params.keyword) {
        filter = {
            $or: [
                { name: { $regex: params.keyword, $options: 'i' } },
                { "meta.location": { $regex: params.keyword, $options: 'i' } },
            ]
        }
    }

    if (params.startPrice && params.endPrice) {
        filter = {
            ...filter,
            "onchainData.price": {
                $gte: params.startPrice,
                $lte: params.endPrice,
            }
        }
    }

    if (params.location) {
        filter = {
            ...filter,
            "meta.location": { $regex: params.location, $options: 'i' }
        }
    }

    if (typeof params.propertyType === 'number') {
        filter = {
            ...filter,
            "onchainData.typeId": {
                $eq: params.propertyType
            }
        }
    }

    if (params.active) {
        filter = {
            ...filter,
            active: params.active,
        }
    }

    if (params.whitelisted) {
        filter = {
            ...filter,
            whitelisted: params.whitelisted,
        }
    }

    if (params.startDate && params.endDate) {
        filter = {
            ...filter,
            createdAt: {
                $gte: moment(new Date(params.startDate)).startOf("day").toDate(),
                $lte: moment(new Date(params.endDate)).endOf("day").toDate()
            }
        }
    }

    if (params.public) {
        filter = {
            ...filter,
            "onchainData.status": "success"
        }
    }


    const result = await Project.aggregate([
        {
            $lookup: {
                from: "transactions",
                localField: "_id",
                foreignField: "project",
                pipeline: [
                    {
                        $group: {
                            _id: "$project",
                            amount: {
                                $sum: "$amount"
                            },
                            minted: {
                                $sum: "$minted"
                            },
                        }
                    },
                    {
                        $project: {
                            gain: "$amount",
                            minted: "$minted",
                        }
                    }
                ],
                as: "trx",
            }
        },
        {
            $unwind: {
                path: "$trx",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $lookup: {
                from: "indonesias",
                let: { pid: "$location.province", rid: "$location.city", did: "$location.district" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$id", "$$pid"]
                            }
                        }
                    },
                    {
                        $unwind: '$regencies',
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: ["$regencies.id", "$$rid"]
                            }
                        },
                    },
                    {
                        $unwind: '$regencies.districts',
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: ["$regencies.districts.id", "$$did"]
                            }
                        },
                    },
                    {
                        $project: {
                            province: {
                                $replaceAll: {
                                    input: "$name",
                                    find: "DI ",
                                    replacement: ""
                                },
                            },
                            city: {
                                $replaceAll: {
                                    input: "$regencies.name",
                                    find: "KABUPATEN",
                                    replacement: "KAB."
                                }
                            },
                            district: "$regencies.districts.name"
                        }
                    },
                    {
                        $project: {
                            fullAddress: {
                                $concat: ["$district", ", ", "$city", ", ", "$province"]
                            }
                        }
                    },
                ],
                as: "loc"
            },
        },
        {
            $unwind: { path: "$loc" }
        },
        {
            $project: {
                name: 1,
                image_urls: 1,
                description: 1,
                location: 1,
                specifications: 1,
                selling_points: 1,
                blueprint: 1,
                prospectus: 1,
                amountRequired: 1,
                timeline: 1,
                onchainData: 1,
                createdAt: 1,
                updatedAt: 1,
                active: 1,
                status: 1,
                whitelisted: 1,
                meta: {
                    gain: { $ifNull: ["$trx.gain", 0] },
                    minted: { $ifNull: ["$trx.minted", 0] },
                    progress: {
                        $multiply: [
                            { $divide: [{ $ifNull: ["$trx.gain", 0] }, "$amountRequired"] },
                            100,
                        ],
                    },
                    location: "$loc.fullAddress"
                },
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    id: "$_id",
                    name: "$name",
                    image_urls: "$image_urls",
                    description: "$description",
                    location: "$location",
                    specifications: "$specifications",
                    selling_points: "$selling_points",
                    blueprint: "$blueprint",
                    prospectus: "$prospectus",
                    amountRequired: "$amountRequired",
                    timeline: "$timeline",
                    onchainData: "$onchainData",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                    active: "$active",
                    status: "$status",
                    whitelisted: "$whitelisted",
                    meta: "$meta",
                },
            },
        },
        { $match: filter },
        { $sort: params.sort ? JSON.parse(params.sort) : { createdAt: -1 } },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                entries: [{ $skip: params.offset ?? 0 }, { $limit: params.limit ?? 10 }],
            },
        },
        {
            $project: {
                entries: 1,
                count: { $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0] }
            }
        }
    ]).then((items: any) => {
        if (items.length > 0) {
            return items[0]
        }

        return { entries: [], count: 0 }
    })

    return result
}

export const getProjectById = async (id: string) => {
    const data: HydratedDocument<IProject>[] = await Project.aggregate([
        {
            $lookup: {
                from: "transactions",
                localField: "_id",
                foreignField: "project",
                pipeline: [
                    {
                        $group: {
                            _id: "$project",
                            amount: {
                                $sum: "$amount"
                            },
                            minted: {
                                $sum: "$minted"
                            },
                        }
                    },
                    {
                        $project: {
                            gain: "$amount",
                            minted: "$minted",
                        }
                    }
                ],
                as: "trx",
            }
        },
        {
            $unwind: {
                path: "$trx",
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $lookup: {
                from: "indonesias",
                let: { pid: "$location.province", rid: "$location.city", did: "$location.district" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$id", "$$pid"]
                            }
                        }
                    },
                    {
                        $unwind: '$regencies',
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: ["$regencies.id", "$$rid"]
                            }
                        },
                    },
                    {
                        $unwind: '$regencies.districts',
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: ["$regencies.districts.id", "$$did"]
                            }
                        },
                    },
                    {
                        $project: {
                            province: {
                                $replaceAll: {
                                    input: "$name",
                                    find: "DI ",
                                    replacement: ""
                                },
                            },
                            city: {
                                $replaceAll: {
                                    input: "$regencies.name",
                                    find: "KABUPATEN",
                                    replacement: "KAB."
                                }
                            },
                            district: "$regencies.districts.name"
                        }
                    },
                    {
                        $project: {
                            fullAddress: {
                                $concat: ["$district", ", ", "$city", ", ", "$province"]
                            }
                        }
                    },
                ],
                as: "loc"
            },
        },
        {
            $unwind: { path: "$loc" }
        },
        {
            $project: {
                name: 1,
                image_urls: 1,
                description: 1,
                location: 1,
                specifications: 1,
                selling_points: 1,
                blueprint: 1,
                prospectus: 1,
                amountRequired: 1,
                timeline: 1,
                onchainData: 1,
                createdAt: 1,
                updatedAt: 1,
                whitelisted: 1,
                meta: {
                    gain: { $ifNull: ["$trx.gain", 0] },
                    minted: { $ifNull: ["$trx.minted", 0] },
                    progress: {
                        $multiply: [
                            { $divide: [{ $ifNull: ["$trx.gain", 0] }, "$amountRequired"] },
                            100,
                        ],
                    },
                    location: "$loc.fullAddress"
                },
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    id: "$_id",
                    name: "$name",
                    image_urls: "$image_urls",
                    description: "$description",
                    location: "$location",
                    specifications: "$specifications",
                    selling_points: "$selling_points",
                    blueprint: "$blueprint",
                    prospectus: "$prospectus",
                    amountRequired: "$amountRequired",
                    timeline: "$timeline",
                    onchainData: "$onchainData",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                    whitelisted: "$whitelisted",
                    meta: "$meta",
                },
            },
        },
        {
            $match: {
                id: new mongoose.Types.ObjectId(id),
            }
        },
    ])

    if (data.length === 0) throw 'project not found'

    return data[0]
}

export const setProjectStatus = async (id: string, active: boolean) => {
    const project: IProject | null = await Project.findByIdAndUpdate(id, { active })
    if (!project) {
        throw new Error('Project not found')
    }

    return project
}

export const updateProject = async (id: string, payload: IProject) => {
    const project: IProject | null = await Project.findByIdAndUpdate(id, { ...payload })
    if (!project) {
        throw new Error('Project not found')
    }

    return project
}

export const getProjectsCount = async () => {
    try {
        const count = await Project.countDocuments().exec()
        return count
    } catch (error) {
        return 0
    }
}

export const setProjectDeployStatus = async (payload: { projectId: number, trxHash?: string, web3: Web3, newProjectId?: number }) => {
    try {
        const { projectId, trxHash, web3, newProjectId } = payload
        const project = await Project.findOne({ "onchainData.projectId": String(projectId) })
        if (!project) throw Error('Project not found')

        const onchainData = project.toObject().onchainData

        if (onchainData.status === 'creating' && onchainData.trxHash === '' && trxHash) {
            project.onchainData.trxHash = trxHash
            project.onchainData.status = 'pending'

            await project.save()
        } else if (onchainData.status === 'pending') {
            const receipt = await web3.eth.getTransactionReceipt(trxHash ?? project.onchainData.trxHash)
            if (receipt !== null) {
                const status = receipt.status ? 'success' : 'failed'

                project.onchainData.trxHash = trxHash
                project.onchainData.status = status

                await project.save()
            }
        } else if (onchainData.status === 'failed' && trxHash && newProjectId) {
            project.onchainData.projectId = newProjectId
            project.onchainData.trxHash = trxHash
            project.onchainData.status = 'pending'

            await project.save()
        } else if (onchainData.status === 'creating' && !trxHash) {
            project.onchainData.status = 'failed'

            await project.save()
        }

        return project
    } catch (error) {
        throw error
    }
}