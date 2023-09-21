import { apiHandler } from "@/lib/ApiHandler";
import Data, { NextApiRequestWithUser } from "@/lib/types/data";
import { NextApiRequest, NextApiResponse } from "next";
import * as projectRepo from "@/lib/repository/ProjectRepository";
import { ProjectQuery } from "@/lib/types/Payload";
import { createRedisConnection } from "@/lib/Database";
import whitelistRepo from "@/lib/repository/WhitelistRepository";

export default apiHandler({
    get: async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
        let addressIsWhitelisted = false

        const redis = await createRedisConnection()
        const isInWhitelistPeriod = await whitelistRepo.isInWhitelistPeriod(redis)
        if (req.user) {
            addressIsWhitelisted = await whitelistRepo.addressIsWhitelisted(redis, req.user.address)
        }

        const whitelistActive = isInWhitelistPeriod && addressIsWhitelisted

        let query: ProjectQuery = {};
        query.limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
        query.offset = req.query.offset ? parseInt(req.query.offset.toString()) : 0;
        query.keyword = req.query.keyword?.toString()
        query.sort = req.query.sort?.toString()

        const { entries: raw_entries, count } = await projectRepo.getProjectList(query)
        const entries = raw_entries.map((entry) => {
            return {
                ...entry,
                whitelisted: whitelistActive && entry.whitelisted,
            }
        })

        res.json({ result: { entries, count } })
    },
})