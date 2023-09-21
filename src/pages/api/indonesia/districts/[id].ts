import { apiHandler } from "@/lib/ApiHandler";
import Indonesia from "@/lib/models/Indonesia";
import { NextApiRequest, NextApiResponse } from "next";

export default apiHandler({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
        const id = req.query.id
        const result = await Indonesia.getRegency(id)

        try {
            res.json(result[0].districts)
        } catch (error) {
            res.json([])
        }
    }
})