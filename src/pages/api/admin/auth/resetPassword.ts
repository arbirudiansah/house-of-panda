import { apiHandler } from "@/lib/ApiHandler";
import { Admin } from "@/lib/models/Admin";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import Data from "@/lib/types/data";

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email, password, token } = req.body;
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

    const jwtSecret = process.env.JWT_SECRET ?? '';

    jwt.verify(token, jwtSecret, async (err: any, decoded: any) => {
        if (err || decoded.resetEmail != email) {
            return res.json({ error: "Invalid Reset Token" });
        }

        admin.setPassword(password);
        await admin.save();

        res.json({ result: 'Reset Password Success. You can login with your new password!' });
    });
}

export default apiHandler({ post: handler });