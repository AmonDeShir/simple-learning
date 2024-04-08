import { Response } from "express";

export namespace Errors {
  export const wrongLoginOrPassword = (res: Response) => 
    res.status(403).json({
      status: 403,
      message: "Wrong login or password"
    })
  
  export const userAlreadyExist = (res: Response) => 
    res.status(409).json({
      status: 409,
      message: "User with that email already exist"
    })
  
  export const userNotExist = (res: Response) => 
    res.status(404).json({
      status: 404,
      message: "User not exist"
    })
  
  export const forbidden = (res: Response) =>
    res.status(403).json({
      status: 403,
      message: "Forbidden"
    })
  
  export const unauthorized = (res: Response) => 
    res.status(401).json({
      status: 401,
      message: "Unauthorized"
    })

  export const accountNotActivated = (res: Response) => 
    res.status(401).json({
      status: 401,
      message: "Please first activate your account"
    })

  export const authenticationTokenExpiredNewOneSended = (res: Response) => 
    res.status(403).json({
      "status": 403,
      "message": "Your token has expired. A new one has been generated and sent, check your email."
    })
}
