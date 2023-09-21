import { apiHandler } from "@/lib/ApiHandler";
import { Admin } from "@/lib/models/Admin";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import Data from "@/lib/types/data";

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email, token, password } = req.body;
    const admin = await Admin.findOne({ email });

    const jwtSecret = process.env.JWT_SECRET ?? '';

    if (!admin) {
        return res.json({ error: "Email address not registered" });
    } else if (admin.isActivated) {
        return res.json({ error: "Account already activated" });
    }

    jwt.verify(token, jwtSecret, async (err: any, decoded: any) => {
        if (err || decoded.activationEmail != email) {
            return res.json({ error: "Invalid Activation Token" });
        }

        admin.activateAdmin();
        admin.setPassword(password);
        await admin.save();
    });

    res.json({ result: "Activation Success. Now you can login to your account" });
}

export default apiHandler({ post: handler });