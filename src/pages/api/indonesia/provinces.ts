import { apiHandler } from "@/lib/ApiHandler";
import Indonesia from "@/lib/models/Indonesia";
import { NextApiRequest, NextApiResponse } from "next";

export default apiHandler({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
        const provinces = await Indonesia.getAllProvince()

        res.json(provinces)
    }
})