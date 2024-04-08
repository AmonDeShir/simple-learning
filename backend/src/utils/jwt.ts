import { Response } from 'express';
import { ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

export interface TokenParams {
  secret: string;
  time: number;
}

interface VerifyResult {
  exp: number,
  iat: number,
  id: string | ObjectId,
}

export class JWT {
  private time: number;
  public token: string;

  constructor(data: TokenParams, id: string | ObjectId) {
    this.time = data.time;
    this.token = jwt.sign({ id }, data.secret, { expiresIn: data.time });
  }

  public cookie(name: string, res: Response) {
    return res.cookie(name, this.token, {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + this.time),
    })
  }

  static emptyCookie(name: string, res: Response) {
    console.log('empty cookie', name);

    return res.clearCookie(name)
  }

  static verify(token: string, data: TokenParams, options: jwt.VerifyOptions = {}): VerifyResult {
    return jwt.verify(token, data.secret, options) as VerifyResult;
  }
}
