import { apiHandler } from "@/lib/ApiHandler";
import Data from "@/lib/types/data";
import { NextApiRequest, NextApiResponse } from "next";
import Project from "@/lib/models/Project";
import { ProjectStatus } from "@/lib/consts";

export default apiHandler({
    post: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const { id, status } = req.body

        if (!id || !status) return res.status(400).json({ error: 'bad request' })
        if (!Object.keys(ProjectStatus).includes(status)) {
            return res.status(400).json({ error: 'invalid project status' })
        }

        const result = await Project.findByIdAndUpdate(id, { status, active: status === "0x01" })

        res.json({ result })
    },
})