import { apiHandler } from "@/lib/ApiHandler";
import Transaction from "@/lib/models/Transaction";
import Data, { NextApiRequestWithUser } from "@/lib/types/data";
import { NextApiResponse } from "next";

export default apiHandler({
    post: async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
        const user = req.user
        const { project, amount, minted, trxHash, action } = req.body
        const trx = new Transaction({
            user: user.id,
            from: user.address,
            project,
            amount,
            minted,
            trxHash,
            meta: {
                action: action ?? 'Mint'
            }
        })
        await trx.save()

        res.json({ result: trx._id })
    }
})