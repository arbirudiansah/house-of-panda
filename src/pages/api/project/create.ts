import { apiHandler } from "@/lib/ApiHandler";
import Data from "@/lib/types/data";
import { NextApiRequest, NextApiResponse } from "next";
import * as projectRepo from "@/lib/repository/ProjectRepository";
import { ProjectPayload } from "@/lib/types/Project";

export default apiHandler({
    post: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const payload: ProjectPayload = req.body;
        const result = await projectRepo.createProject(payload);

        res.json({ result })
    },
}, { adminOnly: true })