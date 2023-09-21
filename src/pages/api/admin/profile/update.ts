import { apiHandler } from "@/lib/ApiHandler";
import * as adminRepo from "@/lib/repository/AdminRepository";
import { Admin } from "@/lib/models/Admin";
import type { NextApiResponse } from "next";
import Data, { NextApiRequestWithUser } from "@/lib/types/data";
// import { sendAdminChangeEmailLink } from "@/lib/utils/sendMail";


export default apiHandler({
    post: async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
        const admin = await Admin.findById(req.user.id);
        const { fullName, email, password, newPassword } = req.body;

        let result = {};

        if (fullName) {
            result = await adminRepo.setAdminFullName(req.user.id, req.body.fullName);
        } else if (email && password) {
            if (!admin.validPassword(password)) {
                return res.json({ error: "Password doesn't match" });
            } else if (await adminRepo.isEmailExists(email)) {
                return res.json({ error: "Email address already registered" });
            }

            const confirmToken = admin.generateConfirmToken();
            result = await adminRepo.setAdminEmail(req.user.id, email, confirmToken);
            // await sendAdminChangeEmailLink(admin.email, email, admin.fullName, confirmToken);
        } else if (password && newPassword) {
            if (!admin.validPassword(password)) {
                return res.json({ error: "Old Password doesn't match" });
            }

            result = await adminRepo.setAdminPassword(req.user.id, newPassword);
        } else {
            return res.json({ error: "No data to update" });
        }

        res.json({ result });
    }
}, { adminOnly: true });