import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Config } from "../config/config";
import { UsersDao } from "../models/user.model";
import { Errors } from "../utils/error";
import { JWT } from "../utils/jwt";
import { AuthenticatedRequest } from "../middlewares/auth-guard.middleware";
import { Mailer } from "../mailer/mailer";

export namespace AuthController {
  export const useNoSync = async (req: Request, res: Response) => {
    const user = await UsersDao.createLocally();

    const access = new JWT(Config.jwt.access, user.id);
    const locally = new JWT(Config.jwt.useLocally, user.id);

    user.locallyToken = locally.token;
    await user.save();

    access.cookie('ACCESS', res);
    locally.cookie('LOCALLY', res);

    return res.status(200).json({
      "status": 200,
      "data": {
        name: 'Anonymous',
        sync: false
      }
    });
  }

  export const register = async (req: Request, res: Response) => {
    const { email, name, password, importData } = req.body;
    const locallyToken = req.cookies.LOCALLY;

    const userExist = await UsersDao.findByEmail(email);

    if (userExist) {
      return Errors.userAlreadyExist(res);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UsersDao.create({ name, email, password: hashedPassword, savedWords: '' });

    const { token } = new JWT(Config.jwt.verification, user.id);
    Mailer.sendAuthenticateMail(email, token);

    if (importData && locallyToken) {
      try {
        const { id } = JWT.verify(locallyToken, Config.jwt.useLocally);
        const locallyUser = await UsersDao.findLocallyById(id)
        
        if (locallyUser) {
          await UsersDao.merge(user.id, locallyUser.id);
          JWT.emptyCookie('LOCALLY', res);
        }
      }
      catch(e) {
        console.log("error", e);
      }
    }

    return res.status(201).json({
      "status": 201,
      "message": "success"
    })
  }

  export const logIn = async (req: Request, res: Response) => {    
    const { email, password } = req.body;
    const user = await UsersDao.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Errors.wrongLoginOrPassword(res);
    }

    const access = new JWT(Config.jwt.access, user.id);
    const refresh = new JWT(Config.jwt.refresh, user.id);

    user.refreshToken = refresh.token;
    await user.save();

    access.cookie('ACCESS', res);
    refresh.cookie('REFRESH', res);

    return res.status(200).json({
      "status": 200,
      "data": {
        "name": user.name,
        "sync": true,
      }
    });
  }

  export const logOut = async (req: AuthenticatedRequest, res: Response) => {
    const { user } = req.body;

    user.refreshToken = undefined;
    await user.save();

    JWT.emptyCookie('ACCESS', res);
    JWT.emptyCookie('REFRESH', res);

    return res.status(200).json({
      "status": 200,
      "message": "success"
    });
  }

  export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.REFRESH;
    let userName = 'Anonymous';

    if (!token && req.cookies.LOCALLY) {
      return await refresh_by_locally_token(req, res);
    } 

    try {
      const { id } = JWT.verify(token, Config.jwt.refresh);
      const user = await UsersDao.findById(id);
      
      if (!user) {
        if (req.cookies.LOCALLY) {
          return await refresh_by_locally_token(req, res);
        } 

        return Errors.userNotExist(res);
      }

      if (user.refreshToken !== token) {
        return Errors.unauthorized(res);
      } 

      const access = new JWT(Config.jwt.access, user.id);
      
      access.cookie('ACCESS', res);
      userName = user.name;
    }
    catch(err) {
      return Errors.forbidden(res);
    }

    return res.status(200).json({
      "status": 200,
      "data": {
        name: userName,
        sync: true
      }
    })
  }

  const refresh_by_locally_token = async (req: Request, res: Response) => {
    const token = req.cookies.LOCALLY;

    if (!token) {
      return Errors.unauthorized(res);
    } 

    try {
      const { id } = JWT.verify(token, Config.jwt.useLocally);
      const user = await UsersDao.findLocallyById(id);

      if (!user) {
        return Errors.userNotExist(res);
      }

      if (user?.locallyToken !== token) {
        return Errors.unauthorized(res);
      }

      const access = new JWT(Config.jwt.access, user.id);
      access.cookie('ACCESS', res);
    }
    catch(err) {
      return Errors.forbidden(res);
    }

    return res.status(200).json({
      "status": 200,
      "data": {
        name: 'Anonymous',
        sync: false
      }
    })
  }

  export const sendPasswordResetEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await UsersDao.findByEmail(email);
    
    if (user) {
      const { token } = new JWT(Config.jwt.passwordReset, user.id);
      Mailer.sendResetPasswordMail(email, token);
    }

    return res.status(200).json({
      "status": 200,
      "message": "success"
    })
  }
  
  export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
      const { id } = JWT.verify(token, Config.jwt.passwordReset);
      const user = await UsersDao.findById(id);

      if (!user) {
        return Errors.forbidden(res);
      }

      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
    catch(err) {
      return Errors.forbidden(res);
    }

    return res.status(200).json({
      "status": 200,
      "message": "success"
    })
  }
  
  export const confirmAccount =  async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
      const { id } = JWT.verify(token, Config.jwt.verification);
      const user = await UsersDao.findById(id);

      if (!user) {
        return Errors.forbidden(res);
      }

      user.activated = true;
      await user.save();
    }
    catch(err: any) {
      if(err.name === 'TokenExpiredError') {
        if(await resendVerificationEmail(token)) {
          return Errors.authenticationTokenExpiredNewOneSended(res)
        }
      }
    
      return Errors.forbidden(res);
    }

    return res.status(200).json({
      "status": 200,
      "message": "success"
    })
  }

  const resendVerificationEmail = async (token: string) => {
    const { id } = JWT.verify(token, Config.jwt.verification, { ignoreExpiration: true });
    const user = await UsersDao.findById(id);

    if (!user || user.activated) {
      return false;
    }

    const { token: newToken } = new JWT(Config.jwt.verification, user.id);
    Mailer.sendAuthenticateMail(user.email, newToken);

    return true;
  }
}