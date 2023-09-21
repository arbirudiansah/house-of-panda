import { BlackRoof } from '@/lib/web3/BlackRoof';
import { NextApiResponseV2 } from '@/lib/types/data';
import { apiHandler } from '@/lib/ApiHandler';
import { NextApiRequest } from 'next';
import Project from '@/lib/models/Project';
import { createProvider } from '@/lib/web3/BlackRoof';
import { decryptPrivateKey } from '@/lib/utils/crypto';
import { errorHandler } from '@/lib/ErrorHandler';

const web3 = createProvider()
const signer = () => {
    const privateKey = decryptPrivateKey(process.env.ADMIN_KEY!, process.env.PASSWORD!)
    const account = web3.eth.accounts.privateKeyToAccount(privateKey)
    return account
}

export default apiHandler({
    get: async (req: NextApiRequest, res: NextApiResponseV2) => {
        try {
            const blackRoof = new BlackRoof(web3, signer())
            const projects = await Project.find({
                "onchainData.status": {
                    $in: ["pending", "creating", "failed"]
                },
            })

            console.log("🚀 ~ file: check.ts ~ projects:", projects.length)

            const result = await Promise.all([
                ...projects.map(async (project) => {
                    const { _id, name, onchainData, timeline } = project.toObject()
                    if (['pending', 'failed'].includes(onchainData.status) && onchainData.trxHash) {
                        const receipt = await web3.eth.getTransactionReceipt(onchainData.trxHash)
                        if (receipt !== null) {
                            const status = receipt.status ? 'success' : 'failed'

                            await Project.findByIdAndUpdate(_id, {
                                $set: {
                                    onchainData: { ...onchainData, status }
                                }
                            })
                        }
                    } else if (onchainData.status === 'creating') {
                        const projectId = await blackRoof.nextProjectIndex()
                        const data = {
                            ...onchainData,
                            title: name,
                            startTime: new Date(timeline.funding_start),
                            endTime: new Date(timeline.funding_end),
                        }

                        await blackRoof.createProject(data, {
                            onTransactionHash: async (trxHash) => {
                                await Project.findByIdAndUpdate(_id, {
                                    $set: {
                                        onchainData: {
                                            ...onchainData,
                                            projectId,
                                            trxHash,
                                            status: 'pending',
                                        }
                                    }
                                })
                            },
                            onReceipt: async (trxHash) => {
                                await Project.findByIdAndUpdate(_id, {
                                    $set: {
                                        onchainData: {
                                            ...onchainData,
                                            projectId,
                                            trxHash,
                                            status: 'success',
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        await Project.findByIdAndUpdate(_id, {
                            $set: {
                                onchainData: {
                                    status: 'failed',
                                }
                            }
                        })
                    }
                })
            ])

            res.json({ result: result.length })
        } catch (error) {
            console.log("🚀 ~ file: check.ts ~ error:", error)
            res.status(500).json({ error: errorHandler(error) })
        }
    }
})