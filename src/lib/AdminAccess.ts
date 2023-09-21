import { BehaviorSubject, lastValueFrom, take } from "rxjs";
import * as jwt from "jsonwebtoken"
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import moment from "moment";

const accessSubject = new BehaviorSubject(getCookie("adminToken")?.toString() ?? null);

const adminSubject = new BehaviorSubject(
    hasCookie("admin") ? JSON.parse(getCookie("admin")!.toString()) : null
);

export const adminAccess = {
    token: accessSubject.asObservable(),
    admin: adminSubject.asObservable(),
    get tokenValue() {
        return accessSubject.value;
    },
    get adminValue() {
        return adminSubject.value;
    },
    setAdmin,
    isAuthorized: adminAuthorized(),
    authenticate,
    logout,
};

async function authenticate(admin: any) {
    let accessToken = admin.token as string;
    // const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

    const expires = moment().add(1, "day").toDate(); // new Date(decoded.exp! * 1000)

    setCookie("adminToken", accessToken, { expires, sameSite: "strict" });
    setCookie("admin", JSON.stringify(admin), { expires, sameSite: "strict" });

    accessSubject.next(accessToken);
    adminSubject.next(admin);

    const token$ = accessSubject.pipe(take(1));
    return await lastValueFrom(token$);
}

function adminAuthorized() {
    const token = accessSubject.value;
    if (token) {
        const decoded = jwt.decode(token) as any;
        return decoded?.isAdmin ?? false;
    }

    return false;
}

function setAdmin(admin: any) {
    setCookie("admin", JSON.stringify(admin));
}

function logout() {
    deleteCookie("admin");
    deleteCookie("adminToken");
    accessSubject.next(null);
    adminSubject.next(null);
}

export default adminAccess;