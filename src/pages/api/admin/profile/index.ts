import { apiHandler } from "@/lib/ApiHandler";
import { Admin, AdminChangeEmail } from "@/lib/models/Admin";
import type { NextApiResponse } from "next";
import Data, { NextApiRequestWithUser } from "@/lib/types/data";

const detailAdmin = async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
    const admin = await Admin.findById(req.user.id);
    const changeEmail = await AdminChangeEmail.findOne({ adminId: admin.id });
    if (!admin) {
        return res.json({ error: "Admin not found" });
    }

    const result = {
        ...admin.toProfile(),
        changeEmail: changeEmail?.email,
    };
    res.json({ result });
}

export default apiHandler({ get: detailAdmin }, { adminOnly: true });