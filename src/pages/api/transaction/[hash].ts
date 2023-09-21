import { apiHandler } from "@/lib/ApiHandler";
import Transaction from "@/lib/models/Transaction";
import Data, { NextApiRequestWithUser } from "@/lib/types/data";
import { NextApiResponse } from "next";

export default apiHandler({
    post: async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
        const user = req.user.id
        const hash = req.query.hash!.toString()

        const trx = await Transaction.findOne({ user, trxHash: hash })
        trx.status = "Success"
        await trx.save()

        res.json({ result: trx._id })
    },
    delete: async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
        const user = req.user.id
        const hash = req.query.hash!.toString()

        const result = await Transaction.findOneAndDelete({ user, trxHash: hash })

        res.json({ result })
    },
})