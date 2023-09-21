import { apiHandler } from "@/lib/ApiHandler";
import Data from "@/lib/types/data";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateProjectPayload } from "@/lib/types/Project";
import Project from "@/lib/models/Project";
import { createProvider } from "@/lib/web3/BlackRoof";

const web3 = createProvider()

export default apiHandler({
    post: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const id = req.query.id
        const payload: UpdateProjectPayload = req.body;
        const result = await Project.findByIdAndUpdate(id, {
            ...payload,
            location: {
                ...payload.location,
                maps_url: payload.location.maps_url,
            }
        })

        res.json({ result })
    },
    patch: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const id = req.query.id ? parseInt(req.query.id.toString()) : 0

        const projectId = req.body.projectId?.toString()
        const trxHash = req.body.trxHash?.toString()

        const project = await Project.findOne({ "onchainData.projectId": id })
        if (!project) return res.json({ error: 'Project not found' })

        const onchainData = project.toObject().onchainData

        if (onchainData.status === 'creating' && onchainData.trxHash === '' && trxHash) {
            project.onchainData.trxHash = trxHash
            project.onchainData.status = 'pending'

            await project.save()
        } else if (onchainData.status === 'pending') {
            const receipt = await web3.eth.getTransactionReceipt(trxHash ?? project.onchainData.trxHash)
            const status = receipt.status ? 'success' : 'failed'

            project.onchainData.trxHash = trxHash
            project.onchainData.status = status

            await project.save()
        } else if (onchainData.status === 'failed' && trxHash && projectId) {
            project.onchainData.projectId = parseInt(projectId)
            project.onchainData.trxHash = trxHash
            project.onchainData.status = 'pending'

            await project.save()
        }

        res.json({ result: project })
    },
}, { adminOnly: true })