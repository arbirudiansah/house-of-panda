import { apiHandler } from "@/lib/ApiHandler";
import { NextApiRequest, NextApiResponse } from "next";
import Project from "@/lib/models/Project";
import IProject from "@/lib/types/Project";

export default apiHandler({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const id = req.query.id!.toString()
            const data = await Project
                .aggregate<IProject>([
                    {
                        $set: {
                            contentRegex: {
                                $regexFind: { input: "$description", regex: /([^<>]+)(?!([^<]+)?>)/gi }
                            }
                        }
                    },
                    {
                        $set: {
                            description: { $ifNull: ["$contentRegex.match", "$description"] }
                        }
                    },
                    { $unset: ["contentRegex"] },
                    { $match: { "onchainData.projectId": parseInt(id) } }
                ])

            if (data.length < 1) throw 'not found'
            const result = data[0]

            res.json({
                name: result.name,
                description: result.description,
                image: `${process.env.NEXT_PUBLIC_IPFS_HOST}/${id}.jpg`,
                attributes: result.specifications.map(({ name, value }) => {
                    return {
                        trait_type: name,
                        value,
                    }
                })
            })
        } catch (error) {
            res.status(400).json({ error: 'NFT not found' })
        }
    },
}, { adminOnly: true })