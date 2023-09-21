import { apiHandler } from "@/lib/ApiHandler";
import User from "@/lib/models/User";
import Data from "@/lib/types/data";
import { NextApiRequest, NextApiResponse } from "next";
import * as ethUtil from 'ethereumjs-util';
import { errorHandler } from "@/lib/ErrorHandler";

export default apiHandler({
    get: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        try {
            const address = req.query.address!.toString()
            if (!ethUtil.isValidAddress(address)) throw 'Invalid address'

            const result = await User.findOneAndUpdate(
                {
                    address: { $regex: address, $options: 'i' }
                },
                { $setOnInsert: { address, nonce: Math.floor(Math.random() * 1000000) } },
                {
                    returnOriginal: false,
                    upsert: true,
                }
            )
            if (!result) throw 'Failed getting user info'

            res.json({ result })
        } catch (error: any) {
            res.json({ error })
        }
    },
    post: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        try {
            const address = req.query.address!.toString()
            if (!ethUtil.isValidAddress(address)) throw 'Invalid address'

            const signature = req.body.signature
            if (!signature) throw 'invalid signature'

            const user = await User.findOne({
                address: { $regex: address, $options: 'i' }
            })
            const msg = `I am signing to House of Panda site with my one-time nonce: ${user.nonce}`

            const msgBuffer = Buffer.from(msg)
            const msgHash = ethUtil.hashPersonalMessage(msgBuffer)
            const signatureParams = ethUtil.fromRpcSig(signature)
            const publicKey = ethUtil.ecrecover(
                msgHash,
                signatureParams.v,
                signatureParams.r,
                signatureParams.s
            )
            const addressBuffer = ethUtil.publicToAddress(publicKey)
            const recAddr = ethUtil.bufferToHex(addressBuffer)

            if (recAddr.toLowerCase() !== user.address.toLowerCase()) throw 'Signature verification failed'

            user.nonce = Math.floor(Math.random() * 1000000)
            await user.save()

            res.json({ result: user.toAuthUser() })
        } catch (error: any) {
            res.json({ error: errorHandler(error) })
        }
    }
})