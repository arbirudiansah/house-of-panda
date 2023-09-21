import { Admin } from "../src/lib/models/Admin";
import { createConnection } from "../src/lib/Database";

const createAdmin = async () => {
    try {
        console.log('Creating admin...')
        const conn = await createConnection()

        const admin = await Admin.findOneAndUpdate(
            { email: 'admin@hop.com' },
            {
                $set: {
                    fullName: 'Admin hop',
                    email: 'admin@hop.com',
                    emailConfirmed: true,
                    isActivated: true,
                    role: 'SuperAdmin',
                },
            },
            { upsert: true, new: true },
        );
        admin.setPassword('admin123');
        await admin.save();

        console.log('Admin created!');
        await conn.close();
    } catch (error) {
        console.error(error);
    }
}

export default createAdmin