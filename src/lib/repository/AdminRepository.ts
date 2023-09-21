import { Admin, AdminChangeEmail } from "@/lib/models/Admin";
import { Admin as AdminModel, User as UserAdmin } from "@/lib/types/User";
import { SortOrder } from "mongoose";

interface FilterOptions {
    limit: number;
    offset: number;
    query?: string;
    status?: string;
    sortType?: { [key: string]: SortOrder };
}

export const getAdminById = async (id: string): Promise<UserAdmin> => {
    try {
        const admin = await Admin.findById(id)
        if (!admin) throw 'Admin not found';
        return Promise.resolve(admin.toProfile());
    } catch (error) {
        return Promise.reject(error);
    }
}

export const isEmailExists = async (email: string): Promise<boolean> => {
    try {
        const admin = await Admin.findOne({ email });
        return Promise.resolve(!!admin);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const setAdminAvatar = async (id: string, avatar: string) => {
    try {
        const admin = await Admin.findByIdAndUpdate(id, { $set: { avatar } })
        if (!admin) throw 'Admin not found';
        return Promise.resolve(true);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const setAdminFullName = async (id: string, fullName: string): Promise<AdminModel> => {
    try {
        const admin = await Admin.findByIdAndUpdate(id, { $set: { fullName } })
        if (!admin) throw 'Admin not found';
        return Promise.resolve({
            ...admin.toProfile(),
            fullName,
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

export const setAdminEmail = async (id: string, email: string, token: string): Promise<AdminModel> => {
    try {
        // await AdminChangeEmail.create({ adminId: id, email, token });
        const admin = await Admin.findByIdAndUpdate(id, { $set: { emailConfirmed: true, email } })
        if (!admin) throw 'Admin not found';
        return Promise.resolve({
            ...admin.toProfile(),
            email,
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

export const setAdminPassword = async (id: string, password: string) => {
    try {
        const admin = await Admin.findById(id)
        if (!admin) throw 'Admin not found';
        admin.setPassword(password);
        await admin.save();
        return Promise.resolve(admin);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getAdmins = async (opts: FilterOptions) => {
    try {
        let filter: any = {};
        const sort = { createdAt: -1 as SortOrder };

        if (opts.query) {
            filter = {
                fullName: { $regex: opts.query, $options: 'i' }
            }
        }

        const result = await Admin.aggregate([
            {
                $project: {
                    fullName: 1,
                    email: 1,
                    avatar: 1,
                    isActivated: 1,
                    emailConfirmed: 1,
                    isSuspended: 1,
                    isBlocked: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    role: 1,
                    lastLogin: 1,
                },
            },
            { $match: filter },
            { $sort: sort as Record<string, 1 | -1> },
            {
                $facet: {
                    entries: [
                        { $skip: opts.offset },
                        { $limit: opts.limit },
                    ],
                    count: [{ $count: "total" }],
                }
            },
            { $unwind: '$count' },
            {
                $project: {
                    entries: "$entries",
                    count: "$count.total",
                }
            }
        ]);

        if (result.length == 0) {
            return {
                entries: [],
                count: 0,
            }
        }

        const entries: AdminModel[] = result[0].entries
            .map((data: any) => {
                return { id: data._id, ...data }
            })
            .map((data: any) => {
                delete data['_id'];
                return data;
            });

        return { entries, count: result[0].count };
    } catch (error) {
        throw error;
    }
}