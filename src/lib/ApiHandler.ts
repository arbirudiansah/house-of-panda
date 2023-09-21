import type { NextApiRequest, NextApiResponse } from "next";
const expressJwt = require("express-jwt");
import util from "util";
import jwt from 'jsonwebtoken';
import * as database from "@/lib/Database";
// import { User } from "@/lib/models/User";
import Data, { NextApiRequestWithUser } from "@/lib/types/data";
import { Admin } from "./models/Admin";

const jwtSecret = process.env.JWT_SECRET;

interface DataStoredInToken {
  id: string;
  isAdmin: boolean;
  trx: boolean;
  role: string;
}

interface AccessControl {
  adminOnly: boolean;
  roles?: string[];
}

if (!jwtSecret) {
  throw new Error("jwtSecret is not defined in next.config.js");
}

export { apiHandler };

function jwtMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
): NextApiResponse<any> | Promise<void> {
  const middleware = expressJwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
    requestProperty: "user",
  }).unless({
    path: [
      // public routes that don't require authentication
      /^\/api\/admin\/auth\/.*/,
      /^\/api\/indonesia\/.*/,
      /^\/api\/user\/([^\/]*)$/,
      /^\/api\/meta\/([^\/]*)$/,
    ],
  });

  return util.promisify(middleware)(req, res);
}

function errorHandler(err: any, res: NextApiResponse<Data>) {
  if (typeof err === "string") {
    return res.status(500).json({ error: err });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid Authorization Token" });
  }

  return res.status(500).json({ error: err.message });
}

function checkAdminRole(role: string, opts?: AccessControl): boolean {
  const roles = opts?.roles ?? [];
  if (roles.length > 0) {
    return roles.includes(role);
  }

  return true;
}

async function accessControlMiddleware(
  req: NextApiRequestWithUser,
  res: NextApiResponse<Data>,
  opts?: AccessControl,
) {
  const bearer = 'Bearer ';
  let token = req.headers['authorization'];
  if (token?.toString().startsWith(bearer)) {
    token = token.slice(bearer.length, token.length);
  }

  if (token) {
    const result = jwt.verify(token, jwtSecret!) as DataStoredInToken;
  
    if (opts?.adminOnly && !result.isAdmin) {
      return res.status(401).json({ error: "Unauthorized access" });
    } else {
      const findUser = {};
      const admin = await Admin.findById(result.id);
      if (findUser) {
        // req.user = findUser;
      } else if (result.isAdmin && admin && checkAdminRole(result.role, opts)) {
        req.user = admin;
      } else {
        return res.status(401).json({ error: "Unauthorized access" });
      }
    }
  }
}

type Method = 'post' | 'get' | 'delete' | 'put' | 'patch'

function apiHandler(handler: any, opts?: AccessControl) {
  return async (req: NextApiRequestWithUser, res: NextApiResponse<Data>) => {
    try {
      await database.createConnection();

      const method: Method = (req.method?.toLowerCase() as Method) ?? 'get';
      if (!handler[method]) {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      }

      await jwtMiddleware(req, res);
      await accessControlMiddleware(req, res, opts);

      await handler[method](req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  }
}

