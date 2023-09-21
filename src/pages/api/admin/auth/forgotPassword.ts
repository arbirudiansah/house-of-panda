import { apiHandler } from "@/lib/ApiHandler";
// import { sendEmail } from "@/lib/utils/sendMail";
import { Admin } from "@/lib/models/Admin";
import type { NextApiRequest, NextApiResponse } from "next";
import Data from "@/lib/types/data";

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ error: "Email is required" });
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

    const resetToken = admin.generateResetToken();
    const resetLink = `${process.env.NEXT_PUBLIC_WEB_URL}/auth/reset-password?token=${resetToken}`;
    console.log("🚀 ~ resetLink", resetLink);
    await admin.save();
    // await sendEmail(email, {
    //     subject: "House of Panda - Reset your password",
    //     body: `<p>Please click the link below to reset your password:</p> <a href="${resetLink}">${resetLink}</a>`,
    // });

    res.json({ result: "The link to reset your password was sent to your email!" });
}

export default apiHandler({ post: handler });