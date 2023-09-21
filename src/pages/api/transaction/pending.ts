import { NextApiRequestWithUser, NextApiResponseV2 } from '@/lib/types/data';
import { apiHandler } from '@/lib/ApiHandler';
import { getPendingTrxs } from '@/lib/repository/TransactionRepository';

export default apiHandler({
    get: async (req: NextApiRequestWithUser, res: NextApiResponseV2) => {
        const user = req.user.id

        const { page } = req.query

        const perPage = 10
        const offset = page ? (parseInt(page.toString()) - 1) * perPage : 0

        const result = await getPendingTrxs({
            userId: user,
            limit: perPage,
            offset,
        })

        res.json({ result })
    }
})