import { apiHandler } from "@/lib/ApiHandler";
import { Admin, AdminChangeEmail } from "@/lib/models/Admin";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import Data from "@/lib/types/data";

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email, token } = req.body;

    const changeEmail = await AdminChangeEmail.findOne({ email, token });

    if (!changeEmail) {
        return res.json({ error: "Confirm Token is not valid" });
    }

    const admin = await Admin.findById(changeEmail.adminId);

    if (!admin) {
        return res.json({ error: "Email address not registered" });
    }

    if (admin.emailConfirmed) {
        return res.json({ error: "Email address already confirmed" });
    }

    if (!admin.isActivated) {
        return res.json({ error: "Your account is not activated" });
    }

    if (admin.isBlocked) {
        return res.json({ error: "Your account currently blocked" });
    }

    const jwtSecret = process.env.JWT_SECRET ?? '';

    jwt.verify(token, jwtSecret, async (err: any, decoded: any) => {
        if (err || decoded.confirmEmail != email) {
            return res.json({ error: "Invalid Confirmation Token" });
        }

        admin.email = email;
        admin.emailConfirmed = true;
        await admin.save();
        await changeEmail.invalidate();
    });

    res.json({ result: 'Email verified' });
}

export default apiHandler({ post: handler });