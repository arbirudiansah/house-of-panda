import moment from "moment"
import mongoose from "mongoose"
import Transaction from "../models/Transaction"
import User from "../models/User"
import { ResultEntries } from "../types/data"
import { BaseQuery, CollectionParams } from "../types/Payload"
import { Collection, GroupedTransaction, ProjectTransaction } from "../types/Transaction"

export const getTransactionsByProjectId = async (projectId: string, params: BaseQuery): Promise<ResultEntries<ProjectTransaction>> => {
    let dateRange = {}
    if (params.startDate && params.endDate) {
        dateRange = {
            createdAt: {
                $gte: moment(new Date(params.startDate)).startOf("day").toDate(),
                $lte: moment(new Date(params.endDate)).endOf("day").toDate()
            }
        }
    }

    const result = await Transaction.aggregate([
        {
            $lookup: {
                from: "users",
                let: { userId: "$user" },
                as: "user",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$userId"]
                            }
                        }
                    },
                    {
                        $project: {
                            address: "$address",
                        }
                    }
                ]
            },
        },
        { $unwind: { path: "$user" } },
        {
            $match: {
                $and: [
                    { project: new mongoose.Types.ObjectId(projectId) },
                    { "user.address": { $regex: params.keyword ?? '', $options: 'i' } },
                    { ...dateRange },
                ]
            }
        },
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
        if (items.length) {
            return items[0]
        }

        return { entries: [], count: 0 }
    })

    return result
}

export const getTransactions = async (params: BaseQuery): Promise<ResultEntries<GroupedTransaction>> => {
    const result = await Transaction.aggregate([
        {
            $group: {
                _id: "$project",
                amount: {
                    $sum: "$amount"
                },
                minted: {
                    $sum: "$minted"
                },
                lastTrx: {
                    $max: "$createdAt"
                },
                totalTrx: {
                    $sum: 1,
                }
            }
        },
        {
            $lookup: {
                from: "projects",
                let: { projectId: "$_id" },
                as: "project",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$projectId"]
                            }
                        }
                    },
                    {
                        $project: {
                            name: "$name",
                            typeId: "$onchainData.typeId"
                        }
                    }
                ]
            }
        },
        { $unwind: { path: "$project" } },
        {
            $replaceRoot: {
                newRoot: {
                    projectId: "$_id",
                    projectName: "$project.name",
                    projectTypeId: "$project.typeId",
                    amount: "$amount",
                    minted: "$minted",
                    lastTrx: "$lastTrx",
                    totalTrx: "$totalTrx"
                },
            },
        },
        { $sort: params.sort ? JSON.parse(params.sort) : { lastTrx: -1 } },
        { $match: { projectName: { $regex: params.keyword ?? '', $options: 'i' } } },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                entries: [{ $skip: params.offset ?? 0 }, { $limit: params.limit ?? 10 }]
            },
        },
        {
            $project: {
                entries: 1,
                count: { $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0] }
            }
        }
    ]).then((items: any) => {
        if (items.length) {
            return items[0]
        }

        return { entries: [], count: 0 }
    })

    return result
}

export const getMyCollections = async (params: CollectionParams): Promise<ResultEntries<Collection>> => {
    let filter: any = [{ "_id.uid": new mongoose.Types.ObjectId(params.userId), "_id.status": params.status ?? "Success" }]

    if (params.startPrice && params.endPrice) {
        filter.push({
            amount: {
                $gte: params.startPrice,
                $lte: params.endPrice,
            }
        })
    }

    if (params.location) {
        filter.push({ "project.location": { $regex: params.location ?? '', $options: 'i' } })
    }

    if (typeof params.propertyType === 'number') {
        filter.push({
            "project.onchainData.typeId": {
                $eq: params.propertyType
            }
        })
    }

    const result = await Transaction.aggregate([
        {
            $group: {
                _id: {
                    pid: "$project",
                    uid: "$user",
                    status: "$status",
                },
                amount: {
                    $sum: "$amount"
                },
                minted: {
                    $sum: "$minted"
                },
                lastTrx: {
                    $max: "$createdAt"
                },
                userId: {
                    $max: "$user"
                },
            }
        },
        {
            $lookup: {
                from: "projects",
                let: { projectId: "$_id.pid" },
                as: "project",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$projectId"]
                            }
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
                            as: "location"
                        },
                    },
                    { $unwind: { path: "$location", preserveNullAndEmptyArrays: true, } },
                    {
                        $project: {
                            name: "$name",
                            location: "$location.fullAddress",
                            onchainData: "$onchainData",
                            timeline: "$timeline",
                        }
                    }
                ]
            }
        },
        { $unwind: { path: "$project" } },
        {
            $match: {
                $and: [...filter]
            }
        },
        { $sort: params.sort ? JSON.parse(params.sort) : { lastTrx: -1 } },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                entries: [{ $skip: params.offset ?? 0 }, { $limit: params.limit ?? 10 }]
            },
        },
        {
            $project: {
                entries: 1,
                count: {
                    $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0]
                }
            }
        }
    ]).then((items: any) => {
        if (items.length) {
            return items[0]
        }

        return { entries: [], count: 0 }
    })

    return result
}

export const getPendingTrxs = async (params: CollectionParams): Promise<ResultEntries<Collection>> => {
    let filter: any = [{ "user": new mongoose.Types.ObjectId(params.userId), "status": "Pending" }]

    const result = await Transaction.aggregate([
        {
            $lookup: {
                from: "projects",
                let: { projectId: "$project" },
                as: "project",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$projectId"]
                            }
                        }
                    },
                    {
                        $project: { name: "$name" }
                    }
                ]
            }
        },
        { $unwind: { path: "$project" } },
        {
            $match: {
                $and: [...filter]
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                entries: [{ $skip: params.offset ?? 0 }, { $limit: params.limit ?? 10 }]
            },
        },
        {
            $project: {
                entries: 1,
                count: {
                    $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0]
                }
            }
        }
    ]).then((items: any) => {
        if (items.length) {
            return items[0]
        }

        return { entries: [], count: 0 }
    })

    return result
}

export const getTotalInvestment = async (userId: string) => {
    const result = await Transaction.aggregate([
        {
            $group: {
                _id: {
                    user: "$user",
                    status: "$status",
                },
                amount: {
                    $sum: "$amount"
                },
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    userId: "$_id.user",
                    status: "$_id.status",
                    amount: "$amount",
                },
            },
        },
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: "Success",
            }
        }
    ]).then((items: any) => {
        if (items.length) {
            return items[0]
        }

        return { amount: 0 }
    })

    return result
}

export const getTransactionsCount = async () => {
    try {
        const count = await Transaction.countDocuments().exec()
        return count
    } catch (error) {
        return 0
    }
}

export const getUsersCount = async () => {
    try {
        const count = await User.countDocuments().exec()
        return count
    } catch (error) {
        return 0
    }
}

export const getMintedNFTs = async () => {
    try {
        const count = await Transaction.aggregate([
            {
                $project: {
                    minted: {
                        $sum: "$amount",
                    }
                }
            }
        ]).then((items: any) => {
            if (items.length) {
                return items[0].minted
            }

            return 0
        })

        return count
    } catch (error) {
        return 0
    }
}