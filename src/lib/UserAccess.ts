import { BehaviorSubject, take, lastValueFrom } from "rxjs";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import moment from "moment";

const accessSubject = new BehaviorSubject(getCookie("token")?.valueOf() ?? null);
const providerSubject = new BehaviorSubject(getCookie("provider")?.valueOf() ?? null);
const userSubject = new BehaviorSubject(
  hasCookie("user") ? JSON.parse(getCookie("user")!.toString()) : null
);
const showTourSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('showTour') ?? 'true'))

export const userAccess = {
  token: accessSubject.asObservable(),
  get tokenValue() {
    return accessSubject.value;
  },
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  get providerValue() {
    return (getCookie("provider")?.valueOf() ?? null) as string | null;
  },
  showTour: showTourSubject.asObservable(),
  get showTourValue() {
    return process.browser && JSON.parse(localStorage.getItem('showTour') ?? 'true');
  },
  setShowTour,
  setUser,
  authenticate,
  logout,
};

async function authenticate(user: any, provider: any) {
  let accessToken = user.token as string;
  // const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

  const expires = moment().add(1, "day").toDate(); // new Date(decoded.exp! * 1000)

  setCookie("token", accessToken, { expires, sameSite: "strict" });
  setCookie("user", JSON.stringify(user), { expires, sameSite: "strict" });
  setCookie("provider", provider, { expires, sameSite: "strict" });

  accessSubject.next(accessToken);
  userSubject.next(user);

  const token$ = accessSubject.pipe(take(1));
  return await lastValueFrom(token$);
}

function setUser(user: any) {
  setCookie("user", JSON.stringify(user));
}

function setShowTour(value: boolean) {
  if (process.browser) {
    localStorage.setItem("showTour", `${value}`)
  }
}

function logout() {
  deleteCookie("token");
  deleteCookie("user")
  deleteCookie("provider")
  accessSubject.next(null);
  userSubject.next(null);
  providerSubject.next(null)
}


export default userAccess;