import { apiHandler } from "@/lib/ApiHandler";
import { Admin } from "@/lib/models/Admin";

import type { NextApiRequest, NextApiResponse } from "next";
import Data from "@/lib/types/data";

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ error: "Missing required fields" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
        return res.json({ error: "Email address not registered" });
    }

    if (!admin.isActivated) {
        return res.json({ error: "Your account is not activated" });
    }

    if (admin.isBlocked) {
        return res.json({ error: "Your account currently blocked" });
    }

    if (!admin.validPassword(password)) {
        return res.json({ error: "Password doesn't match" });
    }

    const result = admin.toAuthAdmin();
    await admin.setLastLogin();

    res.json({ result });
}

export default apiHandler({ post: handler });