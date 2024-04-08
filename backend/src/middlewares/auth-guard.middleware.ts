import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import { Config } from "../config/config";
import { UsersDao } from "../dao/user.dao";
import { LocallyUser } from "../types/locally-user.type";
import { User } from "../types/user.type";
import { Errors } from "../utils/error";
import { JWT } from "../utils/jwt";

export type AuthenticatedRequest<Params = any, ReqBody = any, Query = any> = Request<
  Params,
  {},
  { user: User & LocallyUser & Document<any, any, any> & { _id: any; }} & ReqBody,
  Query
>;

export const authenticationGuard = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.ACCESS;
  
  if (!token) {
    return Errors.unauthorized(res);
  }

  try {
    const { id } = JWT.verify(token, Config.jwt.access);
    let user = await UsersDao.findAnyTypeUserById(id);

    if (!user) {
      return Errors.userNotExist(res);
    }

    if (!user.activated && !user.locallyToken) {
      return Errors.accountNotActivated(res);
    }

    req.body.user = user;
    next();
    return;
  }
  catch(err) {
    return Errors.forbidden(res);
  }
}