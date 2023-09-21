import { apiHandler } from "@/lib/ApiHandler";
import Indonesia from "@/lib/models/Indonesia";
import { NextApiRequest, NextApiResponse } from "next";

export default apiHandler({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
        const id = req.query.id
        const result: any[] = await Indonesia.getProvince(id)

        try {
            res.json(result[0].regencies)
        } catch (error) {
            res.json([])
        }
    }
})